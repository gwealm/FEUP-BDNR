import { client } from "$lib/service/db";
import { validateCredentials } from "$lib/service/user";
import { UserSchema } from "$lib/types";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import * as Aerospike from "aerospike";

export const load: PageServerLoad = ({ cookies }) => {
    const userStr = cookies.get("user");

    if (userStr) {
        const user = UserSchema.parse(JSON.parse(userStr));
        redirect(303, `/user/${user.username}`);
    }
};

export interface LoginErrorObject {
    general?: string;
    identifier?: string;
    password?: string;
}

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();

        const identifier = formData.get("identifier");
        const password = formData.get("password");
        const remember_me = formData.get("remember_me");

        const errors: LoginErrorObject = {};

        if (!password) errors.password = "Missing password";

        // HACK: I love typescript
        const str = (value: unknown): value is string => {
            return typeof value === "string";
        };

        if (!str(identifier) || !str(password))
            errors.password = "Missing password";

        if (Object.keys(errors).length > 0) return fail(422, { errors });

        // @ts-ignore typescript is dumb
        const _user = await validateCredentials(identifier, password);

        if (_user) {
            const cookies = event.cookies;

            cookies.set("user", JSON.stringify(_user), { 
                path: "/",
                maxAge: remember_me ? 60 * 60 * 24 * 14 : 60 * 60 * 24, // 14 days or 1 day
            });

            {
                await client.operate(new Aerospike.Key("test", "users", _user.id), [
                    Aerospike.operations.write("online", "true"),
                ]); // TODO: do not use the raw client.

                Object.values(_user.servers).forEach(async (serverPreview) => {
                    const cdtContext = new Aerospike.cdt.Context().addMapKey(
                        _user.id,
                    );

                    await client.operate(
                        new Aerospike.Key("test", "servers", serverPreview.id),
                        [
                            Aerospike.maps
                                .put("members", "online", "true")
                                .withContext(cdtContext),
                        ],
                    ); // TODO: do not use the raw client.
                });
            }

            throw redirect(303, `/user/${_user.username}`);
        } else {
            errors.general = "Invalid credentials";
        }

        console.log(errors);

        return fail(403, { errors });
    },
};
