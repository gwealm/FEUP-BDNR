import type { Channel, Server } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params: { server } }) => {
    const serverChannels: { [server: Server["id"]]: Channel[] } = {
        "1": [
            {
                id: "1",
                name: "Test Channel 1",
                messages: [],
                server: "1",
            },
            {
                id: "2",
                name: "Test Channel 2",
                messages: [],
                server: "1",
            },
        ],
        "2": [
            {
                id: "3",
                name: "Test Channel 3",
                messages: [],
                server: "2",
            },
        ],
    };

    // TODO: implement data fetching.
    const channels: Channel[] = serverChannels[server];

    return {
        server,
        channels,
    };
};
