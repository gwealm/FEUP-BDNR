import type { ServerPreview } from "$lib/types";
import type { LayoutServerLoad } from "./$types";
import { get } from "svelte/store";
import userStore from "$lib/stores/user";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async () => {
    const user = get(userStore);

    if (!user) {
        throw redirect(303, "/login");
    }

    const servers: ServerPreview[] = Object.values(user.servers);

    return {
        servers,
    };
};
