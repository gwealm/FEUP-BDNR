<script lang="ts">
    import type { Server } from "$lib/types";

    export let member: Server["members"][string];
</script>

<div class="flex items-center gap-2">
    <img
        src={member.image}
        alt="Image for {member.username}"
        class="avatar h-10 w-10 rounded-full"
    />
    {member.username}
</div>
