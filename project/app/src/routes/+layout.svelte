<script lang="ts">
    import "./style.css";

    import ServerPreview from "$lib/components/server/preview.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const { servers } = data;
</script>

<main class="h-full flex">
    <section
        class="w-16 py-2 overflow-y-scroll overflow-x-hidden scrollbar-hide"
        id="server-list"
    >
        <ul class="flex flex-col gap-2 items-center">
            {#each servers as server}
                <li class="">
                    <ServerPreview {server} />
                </li>
            {/each}
        </ul>
    </section>
    <section class="flex-1 bg-zinc-700" id="server-content">
        <slot />
    </section>
</main>
