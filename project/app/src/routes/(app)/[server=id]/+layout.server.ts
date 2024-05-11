import { get } from "$lib/service/db";
import { ServerSchema, type ChannelPreview } from "$lib/types";
import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({
    params: { server: serverId },
}) => {
    const dbResult = await get("servers", serverId);
    const data = dbResult.bins;

    const parseResult = ServerSchema.safeParse(data);

    if (parseResult.success) {
        const server = parseResult.data;

        const channels: ChannelPreview[] = Object.values(server.channels);

        return {
            channels,
            server,
        };
    } else {
        console.log(data, parseResult.error.errors);
        error(500);
    }
};
