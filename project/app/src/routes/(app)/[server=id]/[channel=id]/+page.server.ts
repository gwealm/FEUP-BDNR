import { client, get as dbGet, put } from "$lib/service/db";
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
        messageIds.map(async (messageId) => {
            const dbResult = await dbGet("messages", messageId);
            const data = dbResult.bins;

            const parseResult = MessageSchema.parse(data);

            return parseResult;
        }),
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
        const userStr = cookies.get('user');

        if (!userStr) redirect(303, "/login");

        const formData = await request.formData();
        const searchMessage = formData.get("search");

        if (typeof searchMessage !== "string") {
            return fail(403);
        } else if (searchMessage === "" || searchMessage.length > 2000) {
            return fail(403);
        }

        const { channel } = params;
        const keywords = searchMessage.split(' ');

        let matches: any[] = [];
        for (const keyword of keywords) {   
            
            const keywordMessages = await dbGet('keywords', keyword);
            matches = matches.concat(
                keywordMessages !== null ? 
                keywordMessages.bins.messageIds : 
                []
            );
        
        }
        
        const results: string[] = [];
        for (const match of matches) {
        
            const result = await dbGet('messages', match);
            results.push(
                result !== null ?
                result.bins.content :
                []
            );
        
        }

        return {
            results
        };

    },
};
