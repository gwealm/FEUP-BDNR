<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import type { PageServerData } from "./$types";
    import Message from "$lib/components/message/preview.svelte";

    export let data: PageServerData;

    $: user = data.user;
    $: channel = data.channel;
    $: messages = data.messages;
</script>

<svelte:head>
    <title>{channel.name}@{channel.server}</title>
</svelte:head>

<header class="bg-gray-800 py-4 text-center text-white">
    <h1 class="text-2xl font-bold">{channel.name}</h1>
</header>
{#if user}
    <section class="flex flex-1 flex-col p-4">
        <div class="flex flex-1 flex-col justify-end p-4">
            {#each messages as message (message.id)}
                <Message
                    {message}
                    sentByCurrentUser={message.senderId === user.id}
                    userImage={message.senderImage}
                />
            {/each}
        </div>
        <form class="flex items-center" method="POST" action="/">
            <input
                type="text"
                name="message"
                id="message"
                placeholder="Type your message..."
                autocomplete="off"
                class="input input-bordered flex-1 border-gray-300 bg-white focus:border-blue-500 focus:outline-none"
            />
            <button
                class="ml-2 rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
            >
                <Icon name="send" />
            </button>
        </form>
    </section>
{:else}
    <section class="flex h-full items-center justify-center p-4">
        <div
            class="flex max-w-lg items-center space-x-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        >
            <div class="flex-shrink-0">
                <Icon name="alert-triangle" />
            </div>
            <div>
                <span class="text-lg font-bold">Oops!</span>
                <span>Please log in to send messages.</span>
            </div>
            <a href="/login" class="text-red-500 hover:underline">Login</a>
        </div>
    </section>
{/if}
