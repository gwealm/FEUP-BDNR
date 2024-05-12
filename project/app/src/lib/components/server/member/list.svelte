<script lang="ts">
    import type { Server } from "$lib/types";
    import Member from "./item.svelte";

    export let server: Server;

    $: members = Object.values(server.members);
</script>

<aside class="flex w-80 flex-col items-center gap-5 bg-zinc-700 py-4">
    <header class="text-2xl">
        <h2>Members</h2>
    </header>
    <section class="mt-2">
        <ul class="flex flex-col gap-5">
            {#each members as member (`member-${member.id}`)}
                <li>
                    <Member {member} />
                </li>
            {/each}
        </ul>
    </section>
</aside>
