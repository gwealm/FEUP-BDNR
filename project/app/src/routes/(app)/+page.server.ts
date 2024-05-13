import { UserSchema } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

// If we get a request for this page it means the user has navigated to '/', load the last server the user has visited and proceed.
export const load: PageServerLoad = async ({ cookies }) => {
    const userStr = cookies.get("user");


    if (!userStr) {
        throw redirect(303, "/login");
    } else {
        const user = UserSchema.parse(JSON.parse(userStr));

        throw redirect(307, `/user/${user.username}`);
    }
};
