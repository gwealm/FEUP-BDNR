<script lang="ts">
    import type { Server } from "$lib/types";
    import ServerPreview from "$lib/components/server/preview.svelte";

    const servers: Server[] = [
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
        {
            id: "1",
            name: "Test Server",
            image: "https://picsum.photos/300/300",
            channels: [],
        },
    ];
</script>

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

<style lang="postcss">
</style>
