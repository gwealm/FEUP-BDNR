import type { Server } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
    // TODO: Fetch user data from DB

    const servers: Server[] = [
        {
            id: "1",
            name: "Test Server 1",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "2",
            name: "Test Server 2",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
    ];

    return {
        servers,
    };
};
