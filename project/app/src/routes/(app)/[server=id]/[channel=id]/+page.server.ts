import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { get as dbGet } from "$lib/service/db";
import { ChannelSchema, MessageSchema, UserSchema } from "$lib/types";

export const load: PageServerLoad = async ({ parent, params: { channel: channelId }, cookies }) => {
    const userStr = cookies.get('user');

    if (!userStr) {
        redirect(303, "/login");
    }

    const { user } = await parent();

    const dbResult = await dbGet('channels', channelId);
    const data = dbResult.bins;

    const parseResult = ChannelSchema.safeParse(data);

    if (parseResult.success) {
        const channel = parseResult.data;

        const messageIds = channel.messages;

        // TODO: check if this can be done on the DB rather than on the app.
        const messages = await Promise.all(messageIds.map(async messageId => {

            const dbResult = await dbGet('messages', messageId);
            const data = dbResult.bins;

            const parseResult = MessageSchema.parse(data);

            return parseResult
        }));

        return {
            channel,
            messages,
            user
        };
    } else {
        console.log(data, parseResult.error.flatten())
        error(500);
    }
};
