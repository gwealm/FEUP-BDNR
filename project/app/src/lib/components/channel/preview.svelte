<script lang="ts">
    import type { Channel, Server } from "$lib/types";

    export let channel: Channel;
</script>

<div class="">
    <a href="/{channel.server}/{channel.id}">
        <span>{channel.name}</span>
    </a>
</div>
