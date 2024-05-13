import { sign } from "$lib/service/jwt";
import { UserSchema } from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

// If we reach this loader it means that there has been a request for '/[server]', redirect to the correct channel page
export const load: PageServerLoad = async ({
    parent,
    params: { server },
    cookies,
}) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        redirect(303, "/login");
    } else {
        const { channels } = await parent();
        const user = UserSchema.parse(JSON.parse(userStr));

        if (channels.length === 0) {
            // TODO: better logic
            redirect(303, `/user/${user.username}`);
        }

        const channelId = channels[0].id; // TODO: should we do this differently?

        redirect(307, `/${server}/${channelId}`);
    }
};

export const actions: Actions = {
    generateInviteToken: async ({ request }) => {
        const formData = await request.formData();

        const serverPreview = JSON.parse(formData.get("payload") as string);

        const token = sign(serverPreview);

        return { token };
    }
}