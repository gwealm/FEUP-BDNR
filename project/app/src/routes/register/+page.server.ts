import { promises as fs } from 'fs';
import path from 'path';
import { client, put } from "$lib/service/db";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import * as Aerospike from "aerospike";
import type Key from "key";
import { UserSchema, type User } from '$lib/types';

export const load: PageServerLoad = ({ cookies }) => {
    const userStr = cookies.get("user");

    if (userStr) {
        const user = UserSchema.parse(JSON.parse(userStr));
        redirect(303, `/user/${user.username}`);
    }
};

export interface RegisterErrorObject {
    general?: string;
    username?: string;
    email?: string;
    password?: string;
    password_confirm?: string;
    image?: string;
}

export const actions: Actions = {
    default: async ({ request, cookies, url }) => {
        const formData = await request.formData();

        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const password_confirm = formData.get("password_confirm") as string;
        const imageFile = formData.get("image") as File;

        const errors: RegisterErrorObject = {};

        if (!username) errors.username = "Username is required";
        if (!email) errors.email = "Email is required";
        if (!password) errors.password = "Password is required";
        if (password !== password_confirm) errors.password_confirm = "Passwords do not match";

        const exists = await client.exists(new Aerospike.Key("test", "users", username));
        if (exists) {
            errors.username = "Username already exists";
        }

        if (Object.keys(errors).length > 0) {
            return fail(422, { errors });
        }

        let imageUrl = "unknown_user.png";  // Default image path

        // This is a dumb way to save the image in the db without using blobs
        // We store the image in the filesystem and save the path in the db
        // Not the best solution, but it works for now
        if (imageFile && imageFile.size > 0) {
            try {
                const imageData = await imageFile.arrayBuffer();
                const buffer = Buffer.from(imageData);
                const uploadPath = path.join('static/uploads', `${username}-${Date.now()}.png`);
                await fs.mkdir(path.dirname(uploadPath), { recursive: true });
                await fs.writeFile(uploadPath, buffer);
                imageUrl = `/uploads/${path.basename(uploadPath)}`;  // Update image URL to point to the accessible path
            } catch (error) {
                console.error('Failed to save the image:', error);
                return fail(500, { error: 'Failed to save image' });
            }
        }

        try {
            const user: Omit<User, 'id'> = {
                username,
                email,
                password,  // Note: Hashing the password should be done here in production
                online: false,
                image: `http://${url.host}/${imageUrl}`,  // Storing the accessible path
                servers: {},
                register_date: Date.now(),
            };

            const userId = username;

            const key = await put("users", `${userId}`, user);

            cookies.set("user", JSON.stringify({
                ...user,
                id: key.key as string,
            }), {
                path: "/",
                maxAge: 60 * 60 * 24 * 14, // 14 days
            });
        } catch (error) {
            console.error('Failed to register user:', error);
            errors.general = "Failed to create user";

            return fail(500, { errors });
        }

        redirect(303, "/login");
    }
};
