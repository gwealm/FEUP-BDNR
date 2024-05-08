<script lang="ts">
    import type { ServerPreview } from "$lib/types";

    export let server: ServerPreview;
</script>

<div class="h-12 w-12">
    <a href="/{server.id}">
        <img
            src={server.image}
            alt="Image for {server.name}"
            class="rounded-xl transition-all duration-100 ease-in-out "
        />
    </a>
</div>
