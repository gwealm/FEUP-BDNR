<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import ChannelList from "$lib/components/channel/list.svelte";
    import type { LayoutData } from "./$types";
    import { enhance } from "$app/forms";
    import { addNotification } from "$lib/stores/notifications";

    export let data: LayoutData;

    $: channels = data.channels;
    $: server = data.server;
    $: serverPreview = JSON.stringify({
        id: server.id,
        name: server.name,
        image: server.image,
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const modalElementId = "my_modal_2";

    const showModal = () => {
        document
            .querySelector<HTMLDialogElement>(`#${modalElementId}`)
            ?.showModal();
    };
</script>

<section
    class="scrollbar-hide flex w-72 flex-col items-center overflow-x-hidden overflow-y-scroll"
    id="channel-list"
>
    <div class="flex w-full items-center justify-between">
        <div class="mx-4 py-4 font-bold">{server.name}</div>
        <details class="dropdown dropdown-end">
            <summary class="btn btn-outline btn-sm rounded-box mx-2 mt-1">
                <Icon name="menu" height="2em" width="2em" />
            </summary>
            <ul
                class="menu dropdown-content rounded-box bg-base-100 z-[1] items-center p-2 shadow"
            >
                <li>
                    <form action={`/${server.id}/?/deleteServer`} method="POST">
                        <button class="btn-sm">Delete</button>
                    </form>
                </li>
                <li>
                    <form
                        method="POST"
                        action={`/${server.id}/?/generateInviteToken`}
                        use:enhance={() => {
                            return async ({ result, update }) => {
                                if (result.type === "success") {
                                    const { data } = result;

                                    if (data) {
                                        copyToClipboard(`${data.token}`);
                                        addNotification(
                                            "Invitation token copied to clipboard",
                                        );
                                    }
                                }

                                await update();
                            };
                        }}
                    >
                        <input
                            type="hidden"
                            name="payload"
                            bind:value={serverPreview}
                        />
                        <button class="btn-sm">Invite</button>
                    </form>
                </li>
                <li>
                    <div>
                        <button on:click={showModal}>New Channel</button>
                        <dialog id={modalElementId} class="modal">
                            <div class="modal-box">
                                        <div
                                            class="flex h-full w-full flex-col items-center justify-center gap-2"
                                        >
                                            Create Channel
                                                
                                            <form
                                                action={`/${server.id}/?/createChannel`}
                                                method="post"
                                                class="flex w-full flex-col items-center justify-center gap-2"
                                            >

                                                <input
                                                    type="text"
                                                    class="input input-bordered w-full"
                                                    placeholder="Channel name..."
                                                    name="channel"
                                                    id="serverChannelName"
                                                    required
                                                />

                                            <div class="modal-action flex w-full justify-between items-center">
                                                <button class="btn btn-secondary ml-2 self-start">
                                                    Create
                                                </button>
                                                <form method="dialog">
                                                    <button class="btn">Close</button>
                                                </form>
                                            </div>
                                            </form>
                                        </div>
                            </div>
                        </dialog>
                    </div>
                </li>
            </ul>
        </details>
    </div>

    <div class="divider mx-1 mb-0 mt-0 h-[1px] rounded bg-white" />
    <ChannelList {channels} />
</section>
<section class="flex flex-1 flex-col bg-slate-500" id="channel-content">
    <slot />
</section>
