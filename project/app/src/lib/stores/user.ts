import type { User } from "$lib/types";
import { writable } from "svelte/store";

const user = writable<User | null>();

export default user;
