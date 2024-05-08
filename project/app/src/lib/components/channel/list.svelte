<script lang="ts">
    import type { ChannelPreview as Channel } from "$lib/types";
    import ChannelPreview from "./preview.svelte";

    export let channels: Channel[];
</script>

<ul class="flex flex-col items-center gap-2">
    {#each channels as channel, index (channel.id)}
        <li class="w-full">
            <ChannelPreview {channel} />
        </li>
        {#if index !== channels.length - 1}
            <li class="w-full border-b border-gray-300"></li>
        {/if}
    {/each}
</ul>
