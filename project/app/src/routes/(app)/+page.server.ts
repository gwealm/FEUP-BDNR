import { client, put } from "$lib/service/db";
import { verify } from "$lib/service/jwt";
import { addNotification } from "$lib/stores/notifications";
import { UserSchema, type Channel, type Server, type User } from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import * as Aerospike from "aerospike";
import { promises as fs } from "fs";
import type { JwtPayload } from "jsonwebtoken";
import path from "path";

// If we get a request for this page it means the user has navigated to '/', load the last server the user has visited and proceed.
export const load: PageServerLoad = async ({ cookies }) => {
    const userStr = cookies.get("user");

    if (!userStr) {
        throw redirect(303, "/login");
    } else {
        const user = UserSchema.parse(JSON.parse(userStr));

        throw redirect(307, `/user/${user.username}`);
    }
};

export const actions: Actions = {
    createServer: async ({ request, cookies, url }) => {
        const userStr = cookies.get("user");

        if (!userStr) {
            return fail(401);
        }

        const user = UserSchema.parse(JSON.parse(userStr));

        const formData = await request.formData();

        const serverName = formData.get("name") as string;
        const serverDescription = formData.get("description") as string | null;
        const serverImage = formData.get("image") as File | null;
        const serverChannelName = formData.get("channel") as string;

        const serverId = `server-${Math.random()}`;
        const channelId = `channel-${Math.random()}`;

        const channel: Omit<Channel, "id"> = {
            name: serverChannelName,
            server: serverId,
            messages: [],
        };
        await put("channels", `${channelId}`, channel);

        let imageUrl = "unknown_user.png"; // TODO: change for server

        if (serverImage && serverImage.size > 0) {
            try {
                const imageData = await serverImage.arrayBuffer();
                const buffer = Buffer.from(imageData);
                const uploadPath = path.join(
                    "static/uploads",
                    `servers/${serverId}-${Date.now()}.png`,
                );
                await fs.mkdir(path.dirname(uploadPath), { recursive: true });
                await fs.writeFile(uploadPath, buffer);
                imageUrl = `/uploads/${path.basename(uploadPath)}`; // Update image URL to point to the accessible path
            } catch (error) {
                console.error("Failed to save the image:", error);
            }
        }

        const server: Omit<Server, "id"> = {
            name: serverName,
            description: serverDescription ?? undefined,
            image: `http://${url.host}/${imageUrl}`,
            channels: {
                [channelId]: {
                    id: channelId,
                    name: channel.name,
                    server: serverId,
                },
            },
            owner: {
                id: user.id,
                username: user.username,
            },
            members: {
                [user.id]: {
                    id: user.id,
                    username: user.username,
                    image: user.image,
                    online: user.online,
                },
            },
        };
        await put("servers", `${serverId}`, server);

        const serverPreview: User["servers"][string] = {
            id: serverId,
            name: server.name,
            image: server.image,
            joined_at: Date.now(),
        };
        user.servers[serverId] = serverPreview;
        cookies.set("user", JSON.stringify(user), {
            path: "/",
            maxAge: 60 * 60 * 24 * 14, // 14 days
        });

        await client.operate(new Aerospike.Key("test", "users", user.id), [
            Aerospike.maps.put("servers", serverId, serverPreview),
        ]); // TODO: do not use the raw client.

        addNotification(`Created \"${server.name}\"`, {
            dismissable: true,
        });

        throw redirect(303, `/${serverId}`);
    },
    joinServer: async ({ request, cookies }) => {
        const userStr = cookies.get("user");

        if (!userStr) {
            return fail(401);
        }

        const user = UserSchema.parse(JSON.parse(userStr));

        const formData = await request.formData();

        const token = formData.get("token") as string;

        const jwtServerPreview = verify(token) as JwtPayload;

        await client.operate(
            new Aerospike.Key("test", "servers", jwtServerPreview.id),
            [
                Aerospike.maps.put("members", user.id, {
                    id: user.id,
                    username: user.username,
                    image: user.image,
                    online: user.online,
                }),
            ],
        ); // TODO: do not use the raw client.

        const serverPreview: User["servers"][string] = {
            id: jwtServerPreview.id,
            name: jwtServerPreview.name,
            image: jwtServerPreview.image,
            joined_at: Date.now(),
        };

        const serverId = serverPreview.id;

        user.servers[serverId] = serverPreview;
        cookies.set("user", JSON.stringify(user), {
            path: "/",
            maxAge: 60 * 60 * 24 * 14, // 14 days
        });

        await client.operate(new Aerospike.Key("test", "users", user.id), [
            Aerospike.maps.put("servers", serverId, serverPreview),
        ]); // TODO: do not use the raw client.

        addNotification(`Joined \"${serverPreview.name}\"`, {
            dismissable: true,
        });

        throw redirect(303, `/${serverId}`);
    },
};
