import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// If we reach this loader it means that there has been a request for '/[server]', redirect to the correct channel page
export const load: PageServerLoad = async ({ parent, params: { server } }) => {

    const { user } = await parent();

    const lastServerChannel = user.servers[server];

    redirect(307, `/${server}/${lastServerChannel}`);
}