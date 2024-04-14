<script lang="ts">
    import type { Channel } from "$lib/types";
    import ChannelPreview from "./preview.svelte";

    export let channels: Channel[];
</script>

<ul class="flex flex-col gap-2 items-center">
    {#each channels as channel}
        <li class="w-full">
            <ChannelPreview {channel} />
        </li>
    {/each}
</ul>
