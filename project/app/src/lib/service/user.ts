const validateCredentials = (email: string, password: string): boolean => {

    // TODO: validate using DB
    return email === "test@mail.com" && password === "test";
}

export {
    validateCredentials,
}
