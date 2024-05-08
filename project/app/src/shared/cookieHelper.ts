export function getCookie(name: string) {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null; // Return null if the cookie is not found
}


export function setCookie(name: string, value: string, options: any = {}) {
    if (typeof document !== "undefined") {
        document.cookie = `${name}=${value};${options}`;
    }
}

export function parseCookies() {
    if (typeof document !== "undefined") {
        return document.cookie.split(";").reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split("=");
            return { ...acc, [name]: value };
        }, {});
    } else {
        return {};
    }
}
