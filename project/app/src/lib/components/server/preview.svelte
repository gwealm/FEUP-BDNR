<script lang="ts">
    import type { ServerPreview } from "$lib/types";

    export let server: ServerPreview;
    export let selected = false;
</script>

<div class="h-12 w-12">
    <a href="/{server.id}">
        <img
            src={server.image}
            alt="Image for {server.name}"
            class="rounded-full transition-all duration-100 ease-in-out hover:rounded-xl"
            class:rounded-xl={selected}
        />
    </a>
</div>
