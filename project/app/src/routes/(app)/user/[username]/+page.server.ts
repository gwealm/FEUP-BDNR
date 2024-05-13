import type { PageServerLoad } from "./$types";
import { client } from "$lib/service/db";
import * as Aerospike from "aerospike";
import { error, redirect } from "@sveltejs/kit";
import type Record from "record";
import type Key from "key";
import { UserSchema } from "$lib/types";

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        throw redirect(303, "/login");
    }

    const { username } = params;

    const query = client.query("test", "users");
    query.where(Aerospike.filter.equal("username", username));

    const queryResult: Record[] = await query.results();

    if (queryResult.length !== 1) {
        // More than one user with that identifier (email or username)
        return error(404, `User ${username} not found`);
    }

    const [userResult] = queryResult;

    const data = userResult.bins;
    const userId = (userResult.key as Key).key;

    const result = UserSchema.safeParse({ ...data, id: userId });

    if (result.success) {
        return {
            user: result.data,
        }
    } else {
        console.log(data, result.error.flatten());
        return error(500, "Failed to parse user data");
    }
};
