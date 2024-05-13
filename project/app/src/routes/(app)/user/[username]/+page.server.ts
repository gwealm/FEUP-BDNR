import { get as dbGet } from "$lib/service/db";
import type { PageServerLoad } from "./$types";
import { client } from "$lib/service/db";
import * as Aerospike from "aerospike";
import { error, redirect } from "@sveltejs/kit";
import type Record from "record";
import type Key from "key";
import { MessageSchema, ServerSchema, UserSchema } from "$lib/types";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        throw redirect(303, "/login");
    }

    const { username } = params;

    const userQuery = client.query("test", "users");
    userQuery.where(Aerospike.filter.equal("username", username));

    const userQueryResult: Record[] = await userQuery.results();

    if (userQueryResult.length !== 1) {
        // More than one user with that identifier (email or username)
        return error(404, `User ${username} not found`);
    }

    const [userResult] = userQueryResult;

    const userData = userResult.bins;
    const userId = (userResult.key as Key).key;

    const result = UserSchema.safeParse({ ...userData, id: userId });

    if (!result.success) {
        console.log(userData, result.error.flatten());
        return error(500, "Failed to parse user data");
    }

    const user = result.data;

    const servers = await Promise.all(Object.keys(user.servers).map(async (serverId) => {
        const dbResult = await dbGet("servers", serverId);
        const data = dbResult.bins;

        const parseResult = ServerSchema.safeParse(data);

        if (!parseResult.success) {
            console.log(data, parseResult.error.flatten());
            return error(500, "Failed to parse server data");
        }

        return parseResult.data;
    }));
    
    const msgQuery = client.query("test", "messages");
    msgQuery.where(Aerospike.filter.equal("senderId", user.id));

    const msgQueryResult: Record[] = await msgQuery.results();

    const [msgResult] = msgQueryResult;

    const messages = [];

    for (const msg of msgQueryResult) {
        const msgData = msg.bins;
        const msgId = (msg.key as Key).key;
        const dbResult = MessageSchema.parse({ ...msgData, id: msgId });
        
        messages.push(dbResult);
    }


    return {
        user: user,
        servers: servers,
        messages: messages,
    }
};
