<script lang="ts">
    import type { ServerPreview as Server } from "$lib/types";
    import ServerPreview from "./preview.svelte";

    export let servers: Server[];
</script>

{#if servers.length > 0}
    <ul class="flex flex-col items-center gap-2">
        {#each servers as server (`server-${server.id}`)}
            <li class="">
                <ServerPreview {server} />
            </li>
        {/each}
    </ul>
    <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-white" />
{/if}
