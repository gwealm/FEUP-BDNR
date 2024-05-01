<script lang="ts">
    import type { Server } from "$lib/types";
    import ServerPreview from "./preview.svelte";

    export let servers: Server[];
</script>

<!-- TODO: add generic scrollable list component -->
<ul class="flex flex-col items-center gap-2">
    {#each servers as server (`server-${server.id}`)}
        <li class="">
            <ServerPreview {server} />
        </li>
    {/each}
</ul>
