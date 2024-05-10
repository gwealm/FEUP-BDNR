<script lang="ts">
    import type { ChannelPreview, Server, Message } from "$lib/types";

    export let message: Message;
    export let sentByCurrentUser: boolean = false;

    $: timeStampDate = new Date(message.timestamp);
    $: messageHours =
        timeStampDate.getHours() < 10
            ? `0${timeStampDate.getHours()}`
            : timeStampDate.getHours();
    $: messageMinutes =
        timeStampDate.getMinutes() < 10
            ? `0${timeStampDate.getMinutes()}`
            : timeStampDate.getMinutes();
</script>

<div
    class:chat-start={!sentByCurrentUser}
    class:chat-end={sentByCurrentUser}
    class="chat"
>
    <div class="avatar chat-image">
        <div class="w-10 rounded-full">
            <img
                alt="Profile picture for {message.senderName}"
                src={message.senderImage ?? "https://picsum.photos/300/300"}
            />
        </div>
    </div>
    <div class="chat-bubble max-w-96 rounded-lg bg-gray-200 p-3">
        <div class="text-sm font-bold">
            {message.senderName}
        </div>
        <span style="overflow-wrap: break-word;">
            {message.content}
        </span>
    </div>
    <div class="chat-footer opacity-50">
        {messageHours}:{messageMinutes}
    </div>
</div>
