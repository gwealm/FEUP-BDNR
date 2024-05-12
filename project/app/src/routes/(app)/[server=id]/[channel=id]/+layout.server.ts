import { get as dbGet } from "$lib/service/db";
import {
    ChannelSchema,
} from "$lib/types";
import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({
    parent,
    params: { channel: channelId },
    cookies,
}) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        redirect(303, "/login");
    }

    const { server } = await parent();

    const dbResult = await dbGet("channels", channelId);
    const data = dbResult.bins;

    const parseResult = ChannelSchema.safeParse(data);

    if (parseResult.success) {
        const channel = parseResult.data;

        return {
            channel,
            server
        };
    } else {
        console.log(data, parseResult.error.flatten());
        error(500);
    }
};