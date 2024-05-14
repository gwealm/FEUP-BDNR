import { writable } from 'svelte/store';

export const visibleProfile = writable<string | null>(null);

export const showProfile = (id: string) => {
    visibleProfile.set(id);
};

export const hideProfile = () => {
    visibleProfile.set(null);
};
