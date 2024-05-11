import type { ServerPreview } from "$lib/types";
import { UserSchema } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        throw redirect(303, "/login");
    }
};
