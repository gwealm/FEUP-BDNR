import type { User } from "$lib/types";

const validateCredentials = (email: string, password: string): User | null => {

    if (email === "test@mail.com" && password === "test") {
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
