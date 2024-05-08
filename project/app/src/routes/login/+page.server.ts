import { validateCredentials } from "$lib/service/user";
import user from "$lib/stores/user";
import { setCookie, parseCookies } from "../../shared/cookieHelper";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const actions: Actions = {
    default: async (event) => {
        
        const formData = await event.request.formData();

        const email = formData.get("email");
        const password = formData.get("password");

        if (!email) {
            return fail(422, { email, reason: "Missing email" });
        }

        if (!password) {
            return fail(422, { password, reason: "Missing password" });
        }

        // HACK: I love typescript
        const str = (value: unknown): value is string => {
            return typeof value === "string";
        };

        if (!str(email) || !str(password)) {
            return fail(422, {
                email,
                reason: "Invalid type of data for email and/or password",
            });
        }


        const _user = await validateCredentials(email, password);

        if (_user) {
            // Set user info in cookies
            setCookie("user", JSON.stringify(_user));

            // Set user info in the store
            user.set(_user);

            throw redirect(303, "/@me");
        } else {
            return fail(403, { reason: "Invalid credentials" });
        }

    },
};

