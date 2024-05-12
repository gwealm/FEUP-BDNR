<script lang="ts">
    import { enhance } from "$app/forms";
    import ServerMemberList from "$lib/components/server/member/list.svelte";
    import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;

    const { server, channel } = data;
</script>

<header class="bg-gray-800 py-4 text-white flex justify-between items-center">
    <h1 class="text-2xl font-bold mx-4">{channel.name}</h1>
    <form method="POST" action="?/searchMessage" class="flex mx-10" use:enhance >
        <input 
            type="text"
            name="search"
            id="message"
            placeholder="Search for messages" 
            class="input input-bordered" 
            required
        >
    </form>
</header>

<div class="flex flex-1 overflow-hidden">
    <slot />
    <ServerMemberList {server} />
</div>
