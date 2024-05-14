<script lang="ts">
    import type { ChannelPreview as Channel, Server } from "$lib/types";
    import ChannelPreview from "./preview.svelte";
    import Icon from "../Icon.svelte";

    export let channels: Channel[];
</script>

<ul class="flex flex-col items-center gap-2">
    {#each channels as channel, index (channel.id)}
        <li class="w-full flex justify-between items-center">
            <ChannelPreview {channel} />
            <form action={`/${channel.server}/?/deleteChannel`} method="POST">
                <button class="btn btn-outline btn-sm mx-2">
                    <input type="hidden" name="channel" value={channel.id}>
                    <Icon name="trash-2"/>
                </button>
            </form>
        </li>
        {#if index !== channels.length - 1}
            <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-white" />
        {/if}
    {/each}
</ul>
