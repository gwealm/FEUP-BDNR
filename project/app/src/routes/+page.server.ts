import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// If we get a request for this page it means the user has navigated to '/', load the last server the user has visited and proceed.
export const load: PageServerLoad = async ({ parent }) => {
    const { user } = await parent()

    redirect(307, `/${user.lastServer}`)
}