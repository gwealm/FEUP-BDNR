import userStore from "$lib/stores/user";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

// If we get a request for this page it means the user has navigated to '/', load the last server the user has visited and proceed.
export const load: PageServerLoad = async () => {
    const user = get(userStore);

    if (!user) {
        redirect(303, "/login");
    } else {
        redirect(307, `/${user.lastServer}`);
    }
};
