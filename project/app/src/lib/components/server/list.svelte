<script lang="ts">
    import type { Server } from "$lib/types";
    import ServerPreview from "./preview.svelte";

    export let servers: Server[];
</script>

<!-- TODO: add generic scrollable list component -->
<ul class="flex flex-col gap-2 items-center">
    {#each servers as server}
        <li class="">
            <ServerPreview {server} />
        </li>
    {/each}
</ul>
