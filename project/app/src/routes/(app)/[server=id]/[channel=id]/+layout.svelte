<script lang="ts">
    import { enhance } from "$app/forms";
    import ServerMemberList from "$lib/components/server/member/list.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;

    const { server, channel } = data;

    let showMembers = true;
    let showInfo = false;
</script>

<header class="flex w-full items-center justify-between bg-gray-800 px-4 py-4 text-white">
    <div class="flex-grow"><!-- Spacer to balance the header --></div>
    <h1 class="flex-grow text-center text-2xl font-bold">{channel.name}</h1>
    <div class="flex flex-grow items-center justify-end">
        <form method="POST" action="?/searchMessage" class="flex" use:enhance>
            <input
                type="text"
                name="search"
                id="message"
                placeholder="Search for messages"
                class="input input-bordered"
            />
        </form>
        <button
            class="btn btn-square btn-ghost ml-2 relative"
            on:click={() => (showMembers = !showMembers)}
            on:mouseenter={() => (showInfo = true)}
            on:mouseleave={() => (showInfo = false)}
        >
            <Icon
                height="1.5rem"
                width="1.5rem"
                name={showMembers ? "eye" : "eye-off"}
            />
            {#if showInfo}
                <div class="mt-2 tooltip tooltip-primary tooltip-bottom z-50 bg-gray-700 px-2 py-1 rounded">
                    {showMembers ? "Hide" : "Show"} members
                </div>
            {/if}
        </button>
    </div>
</header>

<div class="flex flex-1 overflow-hidden">
    <slot />
    {#if showMembers}
        <ServerMemberList {server} />
    {/if}
</div>
