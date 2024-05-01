<script lang="ts">
    import type { Channel } from "$lib/types";
    import ChannelPreview from "./preview.svelte";

    export let channels: Channel[];
</script>

<ul class="flex flex-col items-center gap-2">
    {#each channels as channel (`channel-${channel.id}`)}
        <li class="w-full">
            <ChannelPreview {channel} />
        </li>
    {/each}
</ul>
