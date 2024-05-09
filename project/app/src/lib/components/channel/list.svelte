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
            <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-white" />
        {/if}
    {/each}
</ul>
