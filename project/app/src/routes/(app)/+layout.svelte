<script lang="ts">
    import ServerList from "$lib/components/server/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const { servers } = data;
</script>

<section
    class="w-16 py-2 overflow-y-scroll overflow-x-hidden scrollbar-hide flex flex-col gap-2 items-center"
    id="server-list"
>
    <!-- TODO: This should be factored out into a component that also has a list of DMs (if those are added) -->
    <div class="w-12 h-12">
        <a href="/@me">
            <img
                src={"https://picsum.photos/300/300"}
                alt="Image for {'@me'}"
                class="rounded-full hover:rounded-xl transition-all ease-in-out duration-100"
            />
        </a>
    </div>
    <div class="divider mt-0 mb-0 mx-1 bg-white rounded h-1" />
    <ServerList {servers} />
</section>
<section class="flex-1 bg-zinc-700" id="server-content">
    <slot />
</section>
