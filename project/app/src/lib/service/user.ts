import { UserSchema, type User } from "$lib/types";
import { get, client } from "./db";
import * as Aerospike from "aerospike";
import type Key from "key";
import type Record from "record";

const validateCredentials = async (
    email: string,
    password: string,
): Promise<User | null> => {
    // TODO: we should not use the raw client for this but I don't care anymore.
    const query = client.query("test", "users");
    query.where(Aerospike.filter.equal("email", email));
    const queryResult: Record[] = await query.results();

    if (queryResult.length !== 1) {
        // More than one user with that email address
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
    // TODO: implement better checks
    return passwordCandidate === realPassword;
};

export { validateCredentials };
