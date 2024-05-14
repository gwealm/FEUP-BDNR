import { client, get as dbGet, get, put } from "$lib/service/db";
import { MessageSchema, ServerSchema, UserSchema, type Server } from "$lib/types";
import type { PageServerLoad } from "./$types";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import * as Aerospike from "aerospike";
import type Key from "key";
import type Record from "record";

export const load: PageServerLoad = async ({ params, cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        throw redirect(303, "/login");
    }

    const me = UserSchema.parse(JSON.parse(userStr));

    if (me.username.startsWith("DELETED_USER")) {
        cookies.delete("user", { path: "/" });
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

    const servers = await Promise.all(
        Object.keys(user.servers).map(async (serverId) => {
            const dbResult = await dbGet("servers", serverId);
            const data = dbResult.bins;

            const parseResult = ServerSchema.safeParse(data);

            if (!parseResult.success) {
                console.log(data, parseResult.error.flatten());
                return error(500, "Failed to parse server data");
            }

            return parseResult.data;
        }),
    );

    const msgQuery = client.query("test", "messages");
    msgQuery.where(Aerospike.filter.equal("senderId", user.id));
    /*msgQuery.apply("scripts", "record_count", null, null, (error, result) => {
        console.log(error, result);
    });*/

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
        me: me,
        user: user,
        servers: servers,
        messages: messages,
    };
};

// Generate a random 6-digit number
function generateRandomNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

function pickRandomServerMember(server: Server) {
    const members = Object.values(server.members);
    const randomIndex = Math.floor(Math.random() * members.length);
    return members[randomIndex];
}

export const actions: Actions = {
    deleteUser: async ({ request, cookies }) => {
        const userStr = cookies.get("user");

        const randomNumber = generateRandomNumber();

        if (!userStr) {
            return fail(401, { error: "Unauthorized" });
        }

        const user = UserSchema.parse(JSON.parse(userStr));

        const dbResult = await dbGet("users", user.id);
        const userData = dbResult.bins;

        const { password } = userData;

        const data = await request.formData();
        const passwordCandidate = data.get("password");

        // Replace this with actual password validation logic
        if (passwordCandidate !== password) {
            return fail(403, { error: "Invalid password" });
        }

        await put("users", user.id, {
            ...user,
            username: `DELETED_USER_${randomNumber}`,
            email: "unknown@unknown.com",
            image: "deleted_user.png",
            servers: {},
            online: false,
            deleted: true,
        });

        console.log("Erased user data");

        for (const serverId in userData.servers) {
            console.log("Erasing server:", serverId)
            const serverResult = await get("servers", serverId);

            if (serverResult === null) continue;

            const serverData = serverResult.bins;

            const parseResult = ServerSchema.safeParse({ ...serverData, id: serverId });

            if (!parseResult.success) continue; // TODO: see when this can fail.

            const server = parseResult.data;

            const serverOps = [];
            
            if (user.id === server.owner.id) {
                // Owner leaving a server he owns, bruh
                
                delete server.members[user.id];
                const newOwner = pickRandomServerMember(server);

                serverOps.push(
                    Aerospike.maps.put('owner', 'id', newOwner.id),
                    Aerospike.maps.put('owner', 'username', newOwner.username)
                )
            }

            serverOps.push(Aerospike.maps.removeByKey('members', user.id));

            await client.operate(
                new Aerospike.Key('test', 'servers', serverId),
                serverOps
            );
            
            console.log("Erased server membership data for server:", serverId);
        }

        const msgQuery = client.query("test", "messages");
        msgQuery.where(Aerospike.filter.equal("senderId", user.id));

        const msgQueryResult: Record[] = await msgQuery.results();

        for (const msg of msgQueryResult) {
            const msgId = (msg.key as Key).key as string;
            await put("messages", msgId, { ...msg.bins, senderId: "", senderName: "", content: "", deleted: true });
        }

        console.log("Erased messages");

        cookies.delete("user", { path: "/" });

        throw redirect(303, "/login");
    },
};
