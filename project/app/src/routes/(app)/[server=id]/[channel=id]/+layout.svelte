<script lang="ts">
    import ServerMemberList from "$lib/components/server/member/list.svelte";
    import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;

    const { server, channel } = data;
</script>


<header class="bg-gray-800 py-4 text-center text-white">
    <h1 class="text-2xl font-bold">{channel.name}</h1>
</header>
<div class="flex flex-1">
    <slot />
    <ServerMemberList {server} />
</div>
