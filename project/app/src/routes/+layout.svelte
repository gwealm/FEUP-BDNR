<script lang="ts">
    import "./style.css";

    import ServerList from "$lib/components/server/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const { servers } = data;
</script>

<main class="h-full flex">
    <section
        class="w-16 py-2 overflow-y-scroll overflow-x-hidden scrollbar-hide"
        id="server-list"
    >
        <ServerList {servers} />
    </section>
    <section class="flex-1 bg-zinc-700" id="server-content">
        <slot />
    </section>
</main>
