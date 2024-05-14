import { UserSchema, type User } from "$lib/types";
import { client } from "./db";
import * as Aerospike from "aerospike";
import type Key from "key";
import type Record from "record";

const validateCredentials = async (
    identifier: string, // Username or email
    password: string,
): Promise<User | null> => {
    // this is not a good pratice, but for this PoC it's fine
    // by doing this, it means that if a user has "@" in the username, 
    // it will be considered an email
    const isEmail = identifier.includes("@"); 

    const query = client.query("test", "users");
    if (isEmail) {
        query.where(Aerospike.filter.equal("email", identifier));
    } else {
        query.where(Aerospike.filter.equal("username", identifier));
    }

    const queryResult: Record[] = await query.results();

    if (queryResult.length !== 1) {
        // More than one user with that identifier (email or username)
        return null;
    }

    const [userResult] = queryResult;

    const data = userResult.bins;
    const userId = (userResult.key as Key).key;

    const { password: dbPassword } = data;

    const valid = await verifyPassword(password, dbPassword);

    if (valid) {
        const result = UserSchema.safeParse({ ...data, id: userId });

        if (result.success) {
            return result.data;
        } else {
            console.log(data, result.error.flatten());
        }
    }

    return null;
};

const verifyPassword = async (
    passwordCandidate: string,
    realPassword: string,
): Promise<boolean> => {
    return passwordCandidate === realPassword;
};

export { validateCredentials };
