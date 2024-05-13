<script lang="ts">
    import { enhance } from "$app/forms";
    import ServerMemberList from "$lib/components/server/member/list.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import type { LayoutServerData } from "./$types";

    export let data: LayoutServerData;

    const { channel } = data;
    $: server = data.server;

    let showMembers = true;
    let showInfo = false;
</script>

<header
    class="flex w-full items-center justify-between bg-gray-800 px-4 py-4 text-white"
>
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
            class="btn btn-square btn-ghost relative ml-2"
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
                <div
                    class="tooltip tooltip-bottom tooltip-primary z-50 mt-2 rounded bg-gray-700 px-2 py-1"
                >
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
