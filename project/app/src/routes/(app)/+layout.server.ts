import type { ServerPreview } from "$lib/types";
import { UserSchema } from "$lib/types";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        throw redirect(303, "/login");
    }

    const user = UserSchema.parse(JSON.parse(userStr));

    // TODO: this might blow up KKKK
    const servers: ServerPreview[] = Object.values(user.servers);

    return {
        servers,
        user,
    };
};
