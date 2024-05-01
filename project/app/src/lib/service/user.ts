import { UserSchema, type User } from "$lib/types";
import { get } from "./db";

const validateCredentials = async (email: string, password: string): Promise<User | null> => {

    // TODO: fetch user by mail
    const dbResult = await get('users', 'user1');
    const data = dbResult.bins;

    console.log(data);

    const { password: dbPassword } = data;

    const valid = await verifyPassword(password, dbPassword);

    if (valid) {
        const result = UserSchema.safeParse(data);

        if (result.success) {
            return result.data;
        } else {
            console.log(data, result.error.flatten());
        }
    }

    return null;
}

const verifyPassword = async (passwordCandidate: string, realPassword: string): Promise<boolean> => {
    return passwordCandidate === realPassword;
}

export {
    validateCredentials,
}
