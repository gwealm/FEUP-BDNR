import { client, get as dbGet, put } from "$lib/service/db";
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

        const userServers = Object.keys(userData.servers);


        await put("users", user.id, {
            ...user,
            username: `DELETED_USER_${randomNumber}`,
            email: "unknown@unknown.com",
            image: "deleted_user.png",
            servers: {},
            online: false,
            deleted: true,
        });

        const serverQuery = client.query("test", "servers");

        for (const serverId of userServers) {
            serverQuery.where(Aerospike.filter.equal("id", serverId));
            const serverQueryResult: Record[] = await serverQuery.results();

            if (serverQueryResult.length !== 1) {
                return error(404, `Server ${serverId} not found`);
            }

            const [serverResult] = userQueryResult;

            const serverData = serverResult.bins;
            const serverId = (serverResult.key as Key).key;

            const parseResult = ServerSchema.safeParse({ ...serverData, id: serverId });

            const server = parseResult.data;

            let changedMembers = {};

            for (const member of server.members) {
                if (member.id === user.id) {
                    changedMembers += {
                        ...member,
                        username: `DELETED_USER_${randomNumber}`,
                        id: `DELETED_USER_${randomNumber}`,
                    };
                } else {
                    changedMembers += member;
                }
            }

            await put("servers", serverId, {
                ...server,
                ownerId: server.owner.id === user.id ? { ...pickRandomServerMember(server) } : server?.owner,
                members: changedMembers,
            });
        }


        const msgQuery = client.query("test", "messages");
        msgQuery.where(Aerospike.filter.equal("senderId", user.id));

        const msgQueryResult: Record[] = await msgQuery.results();

        for (const msg of msgQueryResult) {
            const msgId = (msg.key as Key).key as string;
            await put("messages", msgId, { content: "", deleted: true });
        }

        cookies.delete("user", { path: "/" });

        throw redirect(303, "/login");
    },
};
