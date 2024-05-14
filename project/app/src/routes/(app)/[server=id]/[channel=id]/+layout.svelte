<script lang="ts">
    import { enhance } from "$app/forms";
    import ServerMemberList from "$lib/components/server/member/list.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import type { LayoutServerData } from "./$types";
    import { writable, get } from "svelte/store";
    import type { Message } from "$lib/types";

    export let data: LayoutServerData;

    const { channel } = data;
    $: server = data.server;

    let filteredMessages: Message[] = [];
    let dropdownEntered = false;

    let showMembers = true;
    let showInfo = false;
</script>

<header
    class="flex w-full items-center justify-between bg-gray-800 px-4 py-4 text-white"
>
    <div class="flex-grow"><!-- Spacer to balance the header --></div>
    <h1 class="flex-grow text-center text-2xl font-bold">{channel.name}</h1>
    <div class="flex flex-grow items-center justify-end">
        <div>
            <form
                method="POST"
                action="?/searchMessage"
                class="flex"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        console.log(result);
                        if (result.type === "success") {
                            const { data } = result;

                            if (data) {
                                /**
                                 * @type {Message[]}
                                 */
                                const messages = data.messages;

                                filteredMessages = messages;
                            }
                        }

                        await update();
                    };
                }}
            >
                <input
                    type="text"
                    name="search"
                    id="message"
                    placeholder="Search for messages"
                    class="input input-bordered"
                />
            </form>
            {#if filteredMessages.length > 0}
                <div
                    class="dropdown dropdown-open absolute top-20 z-20"
                    on:mouseenter={() => (dropdownEntered = true)}
                    on:mouseleave={() => {
                        if (dropdownEntered) {
                            filteredMessages = [];
                            dropdownEntered = false;
                        }
                    }}
                >
                    <ul
                        class="dropdown-content menu bg-base-100 rounded-box z-[1] flex w-52 flex-col gap-2 p-2 shadow"
                    >
                        {#each filteredMessages as message (`search-message-${message.id}`)}
                            <li>
                                <a href={`#message-${message.id}`}>
                                    <div class="flex justify-between">
                                        <div
                                            class="w-10 rounded-full"
                                            class:bg-neutral={!message.senderImage}
                                            class:text-neutral-content={!message.senderImage}
                                        >
                                            <img
                                                src={message.senderImage}
                                                alt="Image for {message.senderName}"
                                                class="rounded-full"
                                            />
                                        </div>
                                        <div class="flex flex-col items-end">
                                            <span
                                                class="overflow-hidden text-ellipsis"
                                                >{message.senderName}</span
                                            >
                                            <span
                                                class="overflow-hidden text-ellipsis"
                                                >{message.content}</span
                                            >
                                        </div>
                                    </div>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
        <button
            class="btn btn-square btn-ghost relative ml-2"
            on:click={() => (showMembers = !showMembers)}
            on:mouseenter={() => (showInfo = true)}
            on:mouseleave={() => (showInfo = false)}
        >
            <Icon
                height="1.5rem"
                width="1.5rem"
                name={showMembers ? "eye" : "eye-off"}
            />
            {#if showInfo}
                <div
                    class="tooltip tooltip-bottom tooltip-primary z-50 mt-2 rounded bg-gray-700 px-2 py-1"
                >
                    {showMembers ? "Hide" : "Show"} members
                </div>
            {/if}
        </button>
    </div>
</header>

<div class="flex flex-1 overflow-hidden">
    <slot />
    {#if showMembers}
        <ServerMemberList {server} />
    {/if}
</div>
