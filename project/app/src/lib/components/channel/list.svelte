<script lang="ts">
    import type { ChannelPreview as Channel, Server } from "$lib/types";
    import ChannelPreview from "./preview.svelte";
    import Icon from "../Icon.svelte";

    export let channels: Channel[];
</script>

<ul class="flex flex-col items-stretch gap-2 p-4 rounded-lg">
    {#each channels as channel, index (channel.id)}
        <li class="flex justify-between items-center p-2 rounded-lg hover:bg-gray-600 transition duration-200 ease-in-out">
            <ChannelPreview {channel} />
            <form action={`/${channel.server}/?/deleteChannel`} method="POST" class="ml-2">
                <input type="hidden" name="channel" value={channel.id}>
                <button class="btn btn-outline btn-sm btn-error">
                    <Icon name="trash-2"/>
                </button>
            </form>
        </li>
        {#if index !== channels.length - 1}
            <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-gray-600" />
        {/if}
    {/each}
</ul>
