<script lang="ts">
    import Icon from "$lib/components/helpers/Icon.svelte";
    import type { PageServerData } from "./$types";
    import { getContext } from "svelte";
    import { parseCookies } from "../../../../shared/cookieHelper";

    const cookies = parseCookies();
    const currentUser = JSON.parse(cookies.user || "{}");

    export let data: PageServerData;
    const { channel, messages } = data;
</script>

<svelte:head>
    <title>{channel.server}@{channel.name}</title>
</svelte:head>

<header class="bg-gray-800 py-4 text-center text-white">
    <h1 class="text-2xl font-bold">{channel.name}</h1>
</header>
<div class="flex h-full flex-col">
    <section class="p-4">
        {#if currentUser.username}
            <div class="flex flex-col p-4">
                {#each messages as message (message.id)}
                    <div
                        class="
                        <!-- {message.sender === currentUser.username
                            ? 'chat-start'
                            : 'chat-end'}  -->
                        chat"
                    >
                        <div class="chat-bubble rounded-lg bg-gray-200 p-3">
                            <div class="text-sm font-bold">
                                {message.sender}
                            </div>
                            {message.content}
                        </div>
                    </div>
                {/each}
            </div>
            <div class="flex items-center">
                <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Type your message..."
                    class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
                <button
                    class="ml-2 rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600"
                >
                    <Icon name="send" />
                </button>
            </div>
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
                    <a href="/login" class="text-red-500 hover:underline"
                        >Login</a
                    >
                </div>
            </section>
        {/if}
    </section>
</div>
