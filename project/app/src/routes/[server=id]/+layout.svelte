<script lang="ts">
    import ChannelList from "$lib/components/channel/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const { channels } = data;
</script>

<div class="h-full flex">
    <section
        class="w-60 py-2 overflow-y-scroll overflow-x-hidden scrollbar-hide"
        id="channel-list"
    >
        <ChannelList {channels} />
    </section>
    <section class="flex-1 bg-slate-500" id="channel-content">
        <slot />
    </section>
</div>
