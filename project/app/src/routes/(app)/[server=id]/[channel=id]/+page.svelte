<script lang="ts">
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    const { channel, messages } = data;
</script>

<header>
    <h1>{channel.name}</h1>
</header>
<div class="flex flex-col">
    {#each messages as messages (messages.id)}
        <span>
            {messages.content}
        </span>
    {/each}
</div>
<section>
    <input type="text" name="" id="" />
    <button>Send</button>
</section>
