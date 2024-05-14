import { client, get as dbGet, put } from "$lib/service/db";
import {
    MessageSchema,
    ServerSchema,
    UserSchema,
    ChannelSchema,
    type Channel,
    type Message,
} from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import Aerospike from "aerospike";
import type Key from "key";
import type Record from "record";

export const load: PageServerLoad = async ({ parent, cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        redirect(303, "/login");
    }

    const { user, channel, server } = await parent();

    const messageIds = channel.messages;

    // TODO: check if this can be done on the DB rather than on the app.
    const messages = await Promise.all(
        messageIds
            .map(async (messageId) => {
                const dbResult = await dbGet("messages", messageId);

                if (!dbResult) return null;

                const data = dbResult.bins;

                const parseResult = MessageSchema.parse(data);

                return parseResult;
            })
            .filter(Boolean),
    );

    return {
        messages,
        user,
        channel,
        server,
    };
};

export const actions: Actions = {
    postMessage: async (event) => {
        const { request, cookies, params } = event;

        const userStr = cookies.get("user");

        if (!userStr) {
            redirect(303, "/login");
        }

        const user = UserSchema.parse(JSON.parse(userStr));

        const formData = await request.formData();
        const messageContent = formData.get("content");

        if (typeof messageContent !== "string") {
            return fail(403);
        } else if (messageContent === "" || messageContent.length > 2000) {
            return fail(403);
        }

        const { channel } = params;

        const messageId = `message-${Math.random()}`;
        const message: Omit<Message, "id"> = {
            content: messageContent,
            senderId: user.id,
            senderName: user.username,
            senderImage: user.image,
            timestamp: Date.now(),
        };

        await put("messages", messageId, message);
        await client.operate(new Aerospike.Key("test", "channels", channel), [
            Aerospike.lists.append("messages", messageId),
        ]); // TODO: do not use the raw client.

        const keywords = messageContent.split(" ");
        for (const keyword of keywords) {
            await client.operate(
                new Aerospike.Key("test", "keywords", keyword),
                [Aerospike.lists.append("messageIds", messageId)],
            );
        }

        return { success: true };
    },
    searchMessage: async ({ request, cookies, params }) => {
        const userStr = cookies.get("user");

        if (!userStr) redirect(303, "/login");

        const formData = await request.formData();

        const searchMessage = formData.get("search") as string;
        const { server: serverId } = params;

        if (typeof searchMessage !== "string") {
            return fail(403);
        } else if (searchMessage === "" || searchMessage.length > 2000) {
            return fail(403);
        }

        const regex =
            /(?:(from:[^\s]+)|(before:[\d]+)|(after:[\d]+)|([\w\d]*))?/g;
        const matches = searchMessage.match(regex);

        if (!matches) return [];

        type SearchParams = {
            before?: number;
            after?: number;
            from?: string;
            tokens: Set<string>;
        };

        const searchParams: SearchParams = {
            tokens: new Set(),
        };

        for (const match of matches) {
            if (!match) continue;

            if (match.startsWith("from:")) {
                const [, username] = match.split(":");

                searchParams.from = username;
            } else if (match.startsWith("before:")) {
                const [, beforeStr] = match.split(":");

                const before = parseInt(beforeStr);

                searchParams.before = before;
            } else if (match.startsWith("after:")) {
                const [, afterStr] = match.split(":");

                const after = parseInt(afterStr);

                searchParams.after = after;
            } else {
                // Normal token, parse as normal

                searchParams.tokens.add(match);
            }
        }

        console.log("searchParams", searchParams);

        const serverData = await dbGet("servers", serverId);

        // TODO: better handling of error, redirect?
        if (!serverData) return [];

        const server = ServerSchema.parse(serverData.bins);

        const messageIdSet = new Set<string>();
        for (const channelID in server.channels) {
            const serverChannel = await dbGet("channels", channelID);

            const channel = ChannelSchema.parse(serverChannel?.bins);

            channel.messages.forEach((messageId) =>
                messageIdSet.add(messageId),
            );
        }
        const messageIds = [...messageIdSet];

        const serverMessages = await Promise.all(
            messageIds
                .map(async (messageId) => {
                    const dbResult = await dbGet("messages", messageId);

                    if (!dbResult) return null;

                    const data = dbResult.bins;

                    const parseResult = MessageSchema.parse({
                        ...data,
                        id: messageId,
                    });

                    return parseResult;
                })
                .filter(Boolean) as Promise<Message>[],
        );

        /*
         * There is no way right now for us to do this kind of processing on the Aerospike server.
         * Besides this, UDFs would not be able to help us in this situation.
         *
         * This might reflect some bad design choices regarding data modeling, although those were taken with other decisions in mind.
         */
        let filteredMessages = serverMessages
            .filter((message) =>
                Object.keys(server.members).includes(message.senderId),
            )
            .filter(
                (message) =>
                    message.timestamp >= (searchParams.after ?? 0) &&
                    message.timestamp <= (searchParams.before ?? Infinity),
            );

        if (searchParams.tokens.size > 0) {
            filteredMessages = filteredMessages.filter((message) => {
                // TODO: ...
                const messageTokens = message.content.split(" ");

                for (const token of messageTokens) {
                    if (searchParams.tokens.has(token)) return true;
                }

                return false;
            });
        }

        if (searchParams.from) {
            // TODO: we should not use the raw client for this but waddayagonnado
            const query = client.query("test", "users", {
                nobins: true,
            });
            query.where(Aerospike.filter.equal("username", searchParams.from));

            const queryResult: Record[] = await query.results();

            if (queryResult.length >= 1) {
                const userResult = queryResult[0];

                const key = userResult.key as Key;

                const userId = key.key;

                filteredMessages = filteredMessages.filter(
                    (message) => message.senderId === userId,
                );
            }
        }

        console.log(filteredMessages);

        return { messages: filteredMessages };
    },
};
