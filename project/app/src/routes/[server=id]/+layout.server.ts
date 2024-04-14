import type { LayoutServerLoad } from "./$types";
import type { Channel } from "$lib/types";

// If we reach this loader it means that there has been a request for '/[server]', redirect to the correct channel page
export const load: LayoutServerLoad = async ({ parent, params: { server } }) => {

    // TODO: implement data fetching.
    const channels: Channel[] = [
        {
            id: "1",
            name: "Test Channel 1",
            messages: [],
        },
        {
            id: "2",
            name: "Test Channel 2",
            messages: [],
        },
    ]

    return {
        server,
        channels
    }
}