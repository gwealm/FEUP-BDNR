
import type { LayoutServerLoad } from "./$types";
import type { Server, User } from "$lib/types";

export const load: LayoutServerLoad = async () => {

    // TODO: Fetch user data from DB
    const user: User = {
        id: "1",
        name: "Test User",
        servers: {
            "1": "1",
            "2": "3",
        },
        lastServer: "1"
    };

    const servers: Server[] = [
        {
            id: "1",
            name: "Test Server 1",
            image: "https://picsum.photos/300/300",
            channels: [
            ],
        },
        {
            id: "2",
            name: "Test Server 2",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
    ];

    return {
        user,
        servers
    };
}