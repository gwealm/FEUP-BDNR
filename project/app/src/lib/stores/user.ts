import { writable } from "svelte/store";
import type { User } from "$lib/types";

const user = writable<User | null>();

const changeCurrentServer = (server: string) => {
    user.update((user) => {
        if (user) {
            user.lastServer = server;
        }
        return user;
    });
};

const changeCurrentChannel = (server: string, channel: string) => {
    user.update((user) => {
        if (user) {
            user.servers[server] = channel;
        }
        return user;
    });
};

user.set({
    id: "1",
    name: "Test User",
    servers: {
        "1": "1",
        "2": "3",
    },
    lastServer: "1"
});

export default user;
export { changeCurrentServer, changeCurrentChannel };

