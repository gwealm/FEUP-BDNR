import type { Actions, PageServerLoad } from "./$types";
import { validateCredentials } from "$lib/service/user";
import { fail, redirect } from "@sveltejs/kit";
import user from "$lib/stores/user";

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();

        const email = formData.get('email');
        const password = formData.get('password');

        // TODO: add better error feedback

        if (!email) {
            return fail(422, { email, reason: "Missing email" });
        }

        if (!password) {
            return fail(422, { password, reason: "Missing password" });
        }

        // HACK: I love typescript
        const str = (value: unknown): value is string => {
            return typeof value === 'string';
        }

        if (!str(email) || !str(password)) {
            return fail(422, { email, reason: "Invalid type of data for email and/or password" });
        }

        const _user = validateCredentials(email, password)

        if (_user) {

            // TODO: better way of setting the user :/
            // Also, perhaps we should put the user in the cookies. Food for thought.
            user.set(_user);

            console.log("Authenticated");

            throw redirect(307, "/");
        } else {
            return fail(403, { email, invalid: true, reason: "Invalid credentials" })
        }
    }
}
