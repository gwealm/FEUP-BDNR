<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
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
                src="/favicon.png"
                alt="Image for {'@me'}"
                class="rounded-xl transition-all duration-100 ease-in-out hover:bg-blue-300"
            />
        </a>
    </div>
    <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-white" />
    <ServerList {servers} />

    <div class="mt-auto mb-2">
        <a href="/logout">
            <Icon name="log-out" height="2em" width="2em" />
        </a>
    </div>
</section>
<section class="flex flex-1 bg-zinc-700" id="server-content">
    <slot />
</section>
