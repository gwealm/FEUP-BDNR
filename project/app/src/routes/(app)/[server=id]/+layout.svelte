<script lang="ts">
    import ChannelList from "$lib/components/channel/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    $: channels = data.channels;
</script>

<div class="flex h-full">
    <section
        class="w-60 overflow-x-hidden overflow-y-scroll py-2 scrollbar-hide"
        id="channel-list"
    >
        <ChannelList {channels} />
    </section>
    <section class="flex-1 bg-slate-500" id="channel-content">
        <slot />
    </section>
</div>
