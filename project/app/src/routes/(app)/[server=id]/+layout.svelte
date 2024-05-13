<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import ChannelList from "$lib/components/channel/list.svelte";
    import type { LayoutData } from "./$types";
    import { enhance } from "$app/forms";

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
</script>

<section
    class="scrollbar-hide flex w-72 flex-col items-center overflow-x-hidden overflow-y-scroll"
    id="channel-list"
>
    <div class="flex w-full items-center justify-between">
        <div class="mx-4 py-4 font-bold">{server.name}</div>
        <details class="dropdown dropdown-end">
            <summary class="btn btn-outline btn-sm rounded-box mx-2">
                <Icon name="menu" height="2em" width="2em" />
            </summary>
            <ul
                class="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
            >
                <li>
                    <form action={`/${server.id}/?/deleteServer`} method="POST">
                        <input
                            type="hidden"
                            name="serverID"
                            value={server.id}
                        />
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

                                    data && copyToClipboard(`${data.token}`);
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
                        <button>Get Token</button>
                    </form>
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
