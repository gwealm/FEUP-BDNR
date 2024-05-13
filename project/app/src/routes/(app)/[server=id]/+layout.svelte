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
    <div class="flex w-full items-center justify-between px-4">
        <span class="py-4 font-bold">{server.name}</span>
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
            <input type="hidden" name="payload" bind:value={serverPreview} />
            <button class="btn btn-sm rounded-full">
                <Icon name="share" />
            </button>
        </form>
    </div>
    <div class="divider mx-1 mb-0 mt-0 h-[1px] rounded bg-white" />
    <ChannelList {channels} />
</section>
<section class="flex flex-1 flex-col bg-slate-500" id="channel-content">
    <slot />
</section>
