<script lang="ts">
    import { enhance } from "$app/forms";
    import ServerMemberList from "$lib/components/server/member/list.svelte";
    import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;

    const { server, channel } = data;
</script>

<header class="flex items-center justify-between bg-gray-800 py-4 text-white">
    <h1 class="mx-4 text-2xl font-bold">{channel.name}</h1>
    <form method="POST" action="?/searchMessage" class="mx-10 flex" use:enhance>
        <input
            type="text"
            name="search"
            id="message"
            placeholder="Search for messages"
            class="input input-bordered"
            required
        />
    </form>
</header>

<div class="flex flex-1 overflow-hidden">
    <slot />
    <ServerMemberList {server} />
</div>
