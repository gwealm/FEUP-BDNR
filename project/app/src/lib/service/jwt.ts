import pkg from "jsonwebtoken";

const { sign: jwtSign, verify: jwtVerify } = pkg;

const SECRET_KEY = "ADORO_AEROSPIKE";

const sign = (payload: object) => {
    return jwtSign(payload, SECRET_KEY, {
        expiresIn: "1h",
    });
};

const verify = (token: string) => {
    return jwtVerify(token, SECRET_KEY);
};

export { sign, verify };
