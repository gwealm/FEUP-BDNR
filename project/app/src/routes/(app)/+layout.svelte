<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import ServerList from "$lib/components/server/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const modalElementId = "my_modal_1";

    const showModal = () => {
        document
            .querySelector<HTMLDialogElement>(`#${modalElementId}`)
            ?.showModal();
    };

    const { servers, user } = data;
</script>

<section
    class="scrollbar-hide flex w-16 flex-col items-center gap-2 overflow-visible py-2"
    id="server-list"
>
    <!-- TODO: This should be factored out into a component that also has a list of DMs (if those are added) -->
    <div class="dropdown dropdown-right">
        <div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
            <div class="h-12 w-12 rounded-xl">
                <img
                    src="/favicon.png"
                    alt="Image for {user.username}"
                    class="rounded-xl transition-all duration-100 ease-in-out hover:bg-blue-300"
                />
            </div>
        </div>
        <ul
            class="menu dropdown-content menu-sm rounded-box bg-base-100 z-10 ml-3 w-52 p-2 shadow"
        >
            <li>
                <a class="justify-between" href="/user/{user.username}">
                    Profile
                </a>
            </li>
            <li><a href="/logout">Logout</a></li>
        </ul>
    </div>
    <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-white" />
    <ServerList {servers} />
    <div>
        <button class="btn h-12 w-12 rounded-full" on:click={showModal}>
            <Icon name="plus" height="2em" width="2em" />
        </button>
        <dialog id={modalElementId} class="modal">
            <div class="modal-box">
                <div role="tablist" class="tabs tabs-bordered">
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        class="tab"
                        aria-label="Join"
                        checked
                    />
                    <div
                        role="tabpanel"
                        class="tab-content rounded-box bg-base-100 px-2 py-6"
                    >
                        <div
                            class="flex h-full w-full flex-col items-center justify-center gap-3"
                        >
                            Join Server
                            <form
                                action="/?/joinServer"
                                method="POST"
                                class="w-full"
                            >
                                <input
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="Please input the server's token to join a server"
                                    name="token"
                                    id="serverToken"
                                    required
                                />
                            </form>
                        </div>
                    </div>

                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        class="tab"
                        aria-label="Create"
                    />
                    <div
                        role="tabpanel"
                        class="tab-content rounded-box bg-base-100 px-2 py-6"
                    >
                        <div
                            class="flex h-full w-full flex-col items-center justify-center gap-3"
                        >
                            Create Server
                            <form
                                action="/?/createServer"
                                method="post"
                                class="flex w-full flex-col items-center justify-center gap-2"
                            >
                                <input
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="Server name..."
                                    name="name"
                                    id="serverName"
                                    required
                                />

                                <input
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="Server description..."
                                    name="description"
                                    id="serverDescription"
                                />

                                <input
                                    type="file"
                                    class="file-input file-input-bordered w-full"
                                    name="image"
                                    id="serverImage"
                                />

                                <input
                                    type="text"
                                    class="input input-bordered w-full"
                                    placeholder="Channel name..."
                                    name="channel"
                                    id="serverChannelName"
                                    required
                                />
                                <button class="btn btn-secondary ml-2 self-end">
                                    <Icon name="send" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal-action">
                    <form method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>

    <div class="mb-2 mt-auto">
        <a href="/logout">
            <Icon name="log-out" height="2em" width="2em" />
        </a>
    </div>
</section>
<section class="flex flex-1 bg-zinc-700" id="server-content">
    <slot />
</section>
