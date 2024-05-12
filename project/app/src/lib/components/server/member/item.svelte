<script lang="ts">
    import type { Server } from "$lib/types";

    export let member: Server["members"][string];
    delete member.image;
</script>

<div class="flex items-center gap-2">
    <div
        class="avatar"
        class:online={member.online}
        class:offline={!member.online}
        class:placeholder={!!member.image}
    >
        <div
            class="w-10 rounded-full"
            class:bg-neutral={!member.image}
            class:text-neutral-content={!member.image}
        >
            {#if member.image}
                <img src={member.image} alt="Image for {member.username}" />
            {:else}
                <span>
                    {member.username.charAt(0)}
                </span>
            {/if}
        </div>
    </div>
    <div class="ml-2 text-base">
        {member.username}
    </div>
</div>
