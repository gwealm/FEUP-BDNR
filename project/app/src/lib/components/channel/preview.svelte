
<script lang="ts">
    import type { ChannelPreview } from "$lib/types";

    export let channel: ChannelPreview;
    export let selected: boolean = false;
</script>

<div class="w-full">
    <a href="/{channel.server}/{channel.id}" class="inline-flex w-full justify-center gap-1 py-2 px-4 hover:bg-gray-600 transition duration-300">
        <span>#</span>
        <span>{channel.name}</span>
    </a>
</div>
