<script lang="ts">
    import ChannelList from "$lib/components/channel/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    $: channels = data.channels;
    $: server = data.server;
</script>

<section
    class="flex w-72 flex-col items-center overflow-x-hidden overflow-y-scroll scrollbar-hide"
    id="channel-list"
>
    <span class="py-4 font-bold">{server.name}</span>
    <div class="divider mx-1 mb-0 mt-0 h-[1px] rounded bg-white" />
    <ChannelList {channels} />
</section>
<section class="flex flex-1 flex-col bg-slate-500" id="channel-content">
    <slot />
</section>
