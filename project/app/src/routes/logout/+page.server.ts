import type { PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        redirect(303, "/");
    }

    cookies.delete("user", { path: "/" });

    // TODO: make the page linger for a bit
    redirect(302, "/");
};
