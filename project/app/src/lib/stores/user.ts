import type { User } from "$lib/types";
import { writable } from "svelte/store";

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
            user.lastServer = server;
            user.servers[server] = channel;
        }
        return user;
    });
};

export default user;
export { changeCurrentServer, changeCurrentChannel };
