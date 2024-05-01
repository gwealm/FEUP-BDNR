import type { PageLoad } from "./$types";
import { get } from "svelte/store";
import userStore from "$lib/stores/user";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = (event) => {
    const user = get(userStore);

    if (user) {
        redirect(303, '/@me');
    }
}