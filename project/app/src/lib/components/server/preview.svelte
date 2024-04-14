<script lang="ts">
    import type { Server } from "$lib/types";

    export let server: Server;
</script>

<div class="w-12 h-12">
    <img
        src={server.image}
        alt="Image for {server.name}"
        class="rounded-full hover:rounded-xl transition-all ease-in-out duration-100"
    />
</div>
