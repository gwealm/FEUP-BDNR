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
    class="scrollbar-hide flex w-72 flex-col items-center overflow-x-hidden overflow-y-scroll bg-gray-800 text-white shadow-lg"
    id="channel-list"
>
    <div
        class="flex w-full items-center justify-between rounded-t-lg px-4 py-5"
    >
        <div class="font-bold">{server.name}</div>
        <details class="dropdown dropdown-end">
            <summary class="btn btn-outline btn-sm rounded-box">
                <Icon name="menu" height="2em" width="2em" />
            </summary>
            <ul
                class="menu dropdown-content rounded-box bg-base-100 z-10 items-center p-2 shadow"
            >
                <li>
                    <form action={`/${server.id}/?/deleteServer`} method="POST">
                        <button class="btn btn-sm btn-error">Delete</button>
                    </form>
                </li>
                <li>
                    <form action={`/${server.id}/?/leaveServer`} method="POST">
                        <button class="btn btn-sm btn-warning">Leave Server</button>
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
                        <button class="btn btn-sm btn-info">Invite</button>
                    </form>
                </li>
                <li>
                    <div>
                        <button
                            class="btn btn-sm btn-success"
                            on:click={showModal}>New Channel</button
                        >
                        <dialog id={modalElementId} class="modal">
<<<<<<< Updated upstream
                            <div class="modal-box rounded-lg p-4 shadow-lg">
=======
                            <div
                                class="modal-box rounded-lg bg-white p-4 shadow-lg"
                            >
>>>>>>> Stashed changes
                                <h3 class="mb-4 text-lg font-semibold">
                                    Create Channel
                                </h3>
                                <form
                                    action={`/${server.id}/?/createChannel`}
                                    method="post"
                                    class="flex w-full flex-col gap-4"
                                >
                                    <input
                                        type="text"
                                        class="input input-bordered w-full"
                                        placeholder="Channel name..."
                                        name="channel"
                                        id="serverChannelName"
                                        required
                                    />
<<<<<<< Updated upstream
=======
                                    <div
                                        class="modal-action flex justify-end gap-2"
                                    >
                                        <button class="btn btn-secondary"
                                            >Create</button
                                        >
                                        <button
                                            class="btn"
                                            type="button"
                                            onclick={() =>
                                                document
                                                    .querySelector(
                                                        `#${modalElementId}`,
                                                    )
                                                    .close()}>Close</button
                                        >
                                    </div>
>>>>>>> Stashed changes
                                </form>
                                <div
                                    class="modal-action flex justify-end gap-2"
                                >
                                    <form method="dialog">
                                        <button class="btn" type="button"
                                            >Close</button
                                        >
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </li>
            </ul>
        </details>
    </div>

    <div class="divider mx-4 my-2 h-[1px] bg-gray-600" />
    <ChannelList {channels} />
</section>
<section class="flex flex-1 flex-col bg-slate-500" id="channel-content">
    <slot />
</section>
