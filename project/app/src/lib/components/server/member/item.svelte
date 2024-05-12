<script lang="ts">
    import type { Server } from "$lib/types";

    export let member: Server["members"][string];
</script>

<div class="flex items-center gap-2">
    <div class="
        avatar
        {member.online ? 'online' : 'offline'}
    ">
        <div class="w-10 rounded-full">
            <img
                src={member.image}
                alt="Image for {member.username}"
            />
        </div>
    </div>
    <div class="ml-2 text-base" >
        {member.username}
    </div>
</div>
