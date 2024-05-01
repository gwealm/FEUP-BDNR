<script lang="ts">
    import type { ChannelPreview, Server } from "$lib/types";

    export let channel: ChannelPreview;
    export let selected: boolean = false;
</script>

<div class="">
    <a
        href="/{channel.server}/{channel.id}"
        class="inline-flex w-full justify-center gap-1"
    >
        <span>#</span>
        <span>{channel.name}</span>
    </a>
</div>
