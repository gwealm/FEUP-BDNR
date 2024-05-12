<script lang="ts">
    import type { Server, User } from "$lib/types";
    import Member from "./item.svelte";

    export let server: Server;
    let searchQuery = '';

    $: members = Object.values(server.members);

    // @ts-ignore im blue dabadi dabada dabadi dabada dabadi dabada dabadi dabada
    $: filteredMembers = members.filter((member: User) => 
        member.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
</script>

<aside class="flex w-80 flex-col items-center gap-5 bg-zinc-700 py-4">
    <header class="text-2xl text-white">
        <h2>Members</h2>
    </header>
    <div class="form-control w-70 px-2">
        <input type="text" placeholder="Search members..." class="input input-bordered w-full"
            bind:value={searchQuery} />
    </div>
    <section class="flex-grow overflow-auto mt-2">
        <ul class="flex flex-col gap-5">
            {#each filteredMembers as member (`member-${member.id}`)}
                <li>
                    <Member {member} />
                </li>
            {/each}
        </ul>
    </section>
</aside>
