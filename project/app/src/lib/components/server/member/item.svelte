<script lang="ts">
    import type { Server } from "$lib/types";

    export let member: Server["members"][string];
    export let serverOwner: string;
</script>

<div class="flex items-center gap-4 p-2 rounded-lg bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition duration-200 ease-in-out">
    <a href={`/user/${member.username}`} class="flex items-center gap-2">
        <div
            class="avatar placeholder"
            class:online={member.online}
            class:offline={!member.online}
        >
            <div
                class="w-12 rounded-full"
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
    </a>
    {#if member.username === serverOwner}
        <div class="badge badge-primary badge-outline">Owner</div>
    {/if}
</div>

