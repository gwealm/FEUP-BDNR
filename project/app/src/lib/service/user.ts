import type { User } from "$lib/types";
import { get } from "./db";

const validateCredentials = async (email: string, password: string): Promise<User | null> => {

    const test = await get('users', 'user1');

    console.log("test", test);

    if (email === "testuser@mail.com" && password === "password") {
        return {
            id: "1",
            name: "Test User",
            servers: {
                "1": "1",
                "2": "3",
            },
            lastServer: "1"
        };
    }

    return null;
}

export {
    validateCredentials,
}
