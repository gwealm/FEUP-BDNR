import { validateCredentials } from "$lib/service/user";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = ({ cookies }) => {

    const userStr = cookies.get("user");

    if (userStr) {
        redirect(303, "/@me");
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

            cookies.set("user", JSON.stringify(_user), { path: "/" });

            throw redirect(303, "/@me");
        } else {
            errors.general = "Invalid credentials";
        }

        console.log(errors);

        return fail(403, { errors });
    },
};
