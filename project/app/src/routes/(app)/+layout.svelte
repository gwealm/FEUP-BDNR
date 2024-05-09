<script lang="ts">
    import ServerList from "$lib/components/server/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const { servers, user } = data;
</script>

<section
    class="flex w-16 flex-col items-center gap-2 overflow-x-hidden overflow-y-scroll py-2 scrollbar-hide"
    id="server-list"
>
    <!-- TODO: This should be factored out into a component that also has a list of DMs (if those are added) -->
    <div class="h-12 w-12">
        <a href="/@me">
            <img
                src={user.image ?? "https://picsum.photos/300/300"}
                alt="Image for {'@me'}"
                class="rounded-full transition-all duration-100 ease-in-out hover:rounded-xl"
            />
        </a>
    </div>
    <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-white" />
    <ServerList {servers} />
</section>
<section class="flex flex-1 bg-zinc-700" id="server-content">
    <slot />
</section>
