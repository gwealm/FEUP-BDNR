import userStore from "$lib/stores/user";
import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { get } from "svelte/store";

export const load: PageLoad = (event) => {
    const user = get(userStore);

    if (user) {
        redirect(303, "/@me");
    }
};
