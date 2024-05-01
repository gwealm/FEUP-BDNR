import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { get } from "svelte/store";
import userStore from "$lib/stores/user";

// If we reach this loader it means that there has been a request for '/[server]', redirect to the correct channel page
export const load: PageServerLoad = async ({ parent, params: { server } }) => {
    const user = get(userStore);

    if (!user) {
        redirect(303, '/login');
    }
}