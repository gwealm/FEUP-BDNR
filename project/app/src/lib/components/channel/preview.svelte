<script lang="ts">
    import type { Channel, Server } from "$lib/types";

    export let channel: Channel;
    export let selected: boolean = false;
</script>

<div class="">
    <a
        href="/{channel.server}/{channel.id}"
        class="w-full inline-flex justify-center gap-1"
    >
        <span>#</span>
        <span>{channel.name}</span>
    </a>
</div>
