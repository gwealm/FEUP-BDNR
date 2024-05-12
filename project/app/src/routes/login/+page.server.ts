import { validateCredentials } from "$lib/service/user";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = ({ cookies }) => {
    const userStr = cookies.get("user");

    if (userStr) {
        redirect(303, "/@me");
    }
};

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();

        const identifier = formData.get("identifier");
        const password = formData.get("password");

        if (!identifier) {
            return fail(422, {
                identifier: identifier,
                reason: "Missing email or username",
            });
        }

        if (!password) {
            return fail(422, { password, reason: "Missing password" });
        }

        // HACK: I love typescript
        const str = (value: unknown): value is string => {
            return typeof value === "string";
        };

        if (!str(identifier) || !str(password)) {
            return fail(422, {
                identifier: identifier,
                reason: "Invalid type of data for email and/or password",
            });
        }

        console.log("AAAAA2", formData);

        const _user = await validateCredentials(identifier, password);

        console.log("AAAAA3", _user);

        if (_user) {
            const cookies = event.cookies;

            cookies.set("user", JSON.stringify(_user), { path: "/" });

            throw redirect(303, "/@me");
        } else {
            return fail(403, { reason: "Invalid credentials" });
        }
    },
};
