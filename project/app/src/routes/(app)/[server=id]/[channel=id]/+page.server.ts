import { client, get as dbGet, put } from "$lib/service/db";
import user from "$lib/stores/user";
import { MessageSchema, UserSchema, type Message } from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import Aerospike from "aerospike";

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

        return { success: true };
    },
    searchMessage: async (event) => {
        const { request, cookies, params } = event;
        const userStr = cookies.get("user");

        if (!userStr) redirect(303, "/login");

        const formData = await request.formData();
        const searchMessage = formData.get("search");

        if (typeof searchMessage !== "string") {
            return fail(403);
        } else if (searchMessage === "" || searchMessage.length > 2000) {
            return fail(403);
        }

        const regex = /^(?:from:([^\s]+)\s*)?(.+)?$/;
        const matches = searchMessage.match(regex);
        
        if (!matches) return [];
        
        const userSearch = matches[1];
        const keywordSearch = matches[2];
        
        const { channel } = params;
        const channelData = await dbGet("channels", channel);

        // TODO: better handling of error, redirect?
        if (!channelData) return [];

        const serverData = await dbGet("servers", channelData.bins.server);

        // TODO: better handling of error, redirect?
        if (!serverData) return [];

        const channelsInfo = serverData.bins.channels;
        const channels = [channelData.bins];
        
        for (const channelID of Object.keys(channelsInfo)) {

            // no need to fetch the data for the current channel
            if (channelID == channel) continue;

            const serverChannel = await dbGet('channels', channelID);
            channels.push(serverChannel?.bins);
            
        }
        
        const members = serverData.bins.members;

        let results: unknown[] = [];
        if (keywordSearch) {

            const keywords = keywordSearch.split(" ");

            let matches: string[] = [];
            for (const keyword of keywords) {
                const keywordMessages = await dbGet("keywords", keyword);
                matches = matches.concat(keywordMessages?.bins.messageIds ?? []);
            }

            // filter out messages that don't belong to the server
            matches = matches.filter(message =>
                channels.some(channel => channel.messages.includes(message))
            );
    
            for (const match of matches) {
                const result = await dbGet("messages", match);
                results.push(result);
            }

            if (userSearch) {
                results = results.filter(
                    result => result?.bins.senderName === userSearch
                );
            }
        
        } else if (userSearch) {

            const userNotInServer = Object.values(members)
                                          .filter(member => member?.username === userSearch)
                                          .length === 0;

            if (userNotInServer) return [];
            
            let serverMessages: unknown[];              
            serverMessages = channels.map(channel => channel.messages).flat();
            serverMessages = await Promise.all( serverMessages.map( messageID => dbGet('messages', messageID) ) );

            results = serverMessages.filter( message => message.bins.senderName === userSearch);

        }
          
        
        console.log(results.map(result => result?.bins.content ?? []));

    },
};
