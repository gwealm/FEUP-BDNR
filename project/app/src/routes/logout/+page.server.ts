import { client } from "$lib/service/db";
import { UserSchema } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import * as Aerospike from "aerospike";

export const load: PageServerLoad = async ({ cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        redirect(303, "/");
    }

    cookies.delete("user", { path: "/" });

    {
        const user = UserSchema.parse(JSON.parse(userStr));

        await client.operate(new Aerospike.Key("test", "users", user.id), [
            Aerospike.operations.write("online", "false"),
        ]); // TODO: do not use the raw client.

        Object.values(user.servers).forEach(async (serverPreview) => {
            const cdtContext = new Aerospike.cdt.Context().addMapKey(user.id);

            await client.operate(
                new Aerospike.Key("test", "servers", serverPreview.id),
                [
                    Aerospike.maps
                        .put("members", "online", "false")
                        .withContext(cdtContext),
                ],
            ); // TODO: do not use the raw client.
        });
    }

    // TODO: make the page linger for a bit
    redirect(302, "/");
};
