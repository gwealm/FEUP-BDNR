<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import type { PageServerData } from "./$types";
    import Message from "$lib/components/message/preview.svelte";
    import { enhance } from "$app/forms";

    export let data: PageServerData;

    let textInput: string = "";

    const user = data.user;
    const channel = data.channel;
    $: messages = data.messages;
    $: enableSend = textInput !== "";
</script>

<svelte:head>
    <title>{channel.name}@{channel.server}</title>
</svelte:head>

{#if user}
    <section class="flex flex-1 flex-col overflow-hidden p-4">
        <div
            class="flex flex-1 flex-col gap-4 overflow-y-scroll p-4"
            style="justify-content: safe flex-end;"
        >
            {#if messages.length > 0}
                {#each messages as message (message.id)}
                    <Message
                        {message}
                        sentByCurrentUser={message.senderId === user.id}
                    />
                {/each}
            {:else}
                <div
                    class="flex w-full flex-1 items-center justify-center text-center"
                >
                    <span class="font-bold">
                        There are no messages on this channel. Be the one to
                        start its history :D
                    </span>
                </div>
            {/if}
        </div>
        <form
            class="flex items-center pt-4"
            method="POST"
            action="?/postMessage"
            use:enhance
        >
            <input
                type="text"
                name="content"
                id="message"
                placeholder="Type your message..."
                autocomplete="off"
                bind:value={textInput}
                class="input input-bordered flex-1 border-gray-300 bg-white focus:border-blue-500 focus:outline-none"
            />
            <button
                class="btn btn-secondary ml-2"
                class:btn-disabled={!enableSend}
                disabled={!enableSend}
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
