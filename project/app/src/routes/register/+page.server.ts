import { promises as fs } from 'fs';
import path from 'path';
import { client } from "$lib/service/db";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import * as Aerospike from "aerospike";

export const load: PageServerLoad = ({ cookies }) => {
    const userStr = cookies.get("user");
    if (userStr) {
        redirect(303, "/@me");
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
    default: async (event) => {
        const formData = await event.request.formData();

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

        let imageUrl = "/unkown_user.png";  // Default image path

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
            await client.put(new Aerospike.Key("test", "users", username), {
                username,
                email,
                password,  // Note: Hashing the password should be done here in production
                online: "false",
                image: imageUrl,  // Storing the accessible path
                servers: JSON.stringify({})
            });
            throw redirect(303, "/login");
        } catch (error) {
            console.error('Failed to register user:', error);
            errors.general = "Failed to create user";
            return fail(500, { errors });
        }
    }
};
