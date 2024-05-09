import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

// If we reach this loader it means that there has been a request for '/[server]', redirect to the correct channel page
export const load: PageServerLoad = async ({ parent, params: { server }, cookies }) => {
    const user = cookies.get('user');

    if (!user) {
        redirect(303, "/login");
    } else {

        const { channels } = await parent();

        if (channels.length === 0) {
            // TODO: better logic
            redirect(303, "/@me");
        }

        const channelId = channels[0].id; // TODO: should we do this differently?

        redirect(307, `/${server}/${channelId}`);
    }
};
