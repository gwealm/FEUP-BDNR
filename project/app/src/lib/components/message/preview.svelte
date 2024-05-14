<script lang="ts">
    import type { Message } from "$lib/types";
    import { onMount } from "svelte";
    import type { Action } from "svelte/action";
    import Icon from "$lib/components/Icon.svelte";

    export let message: Message;
    export let sentByCurrentUser: boolean = false;
    export let isUserOnline: boolean = false;
    export let scroll: Action;

    let now = new Date();
    let timeStampDate = new Date(message.timestamp);
    let displayTime = "";

    const isSameDay = (d1: Date, d2: Date) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    };

    const updateTime = () => {
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const elapsed = new Date() - timeStampDate;
        let time = 0;

        if (elapsed < msPerMinute * 60) {
            time = Math.round(elapsed / msPerMinute);
            displayTime = `${time == 0 ? "< 1" : time} min ago`;
        } else if (elapsed < msPerHour * 3) {
            time = Math.round(elapsed / msPerHour);
            displayTime = `${time == 0 ? "< 1" : time} hrs ago`;
        } else {
            const time =
                timeStampDate.getHours().toString().padStart(2, "0") +
                ":" +
                timeStampDate.getMinutes().toString().padStart(2, "0");
            if (isSameDay(timeStampDate, new Date())) {
                displayTime = time;
            } else {
                displayTime = `${formatDate(timeStampDate)} at ${time}`;
            }
        }
    };

    onMount(() => {
        const interval = setInterval(updateTime, 1000 * 60);
        updateTime();
        return () => {
            clearInterval(interval);
        };
    });
</script>

<div
    class:chat-start={!sentByCurrentUser}
    class:chat-end={sentByCurrentUser}
    class="chat relative"
    id={`message-${message.id}`}
    use:scroll
>
    <div class:online={isUserOnline} class="avatar chat-image">
        <div class="w-10 rounded-full">
            <img
                alt={`Profile picture for ${message.senderName}`}
                src={message.senderImage ?? "/unknown_user.png"}
            />
        </div>
    </div>
    <div>
        <div class="chat-header text-sm font-bold"
        class:text-end={sentByCurrentUser}>
            {message.senderName}
        </div>
        <div
            class:chat-bubble-primary={sentByCurrentUser}
            class:chat-bubble-secondary={!sentByCurrentUser}
            class="chat-bubble max-w-96 rounded-lg p-3 relative group"
            style="overflow-wrap: break-word;"
        >
            {#if !message.deleted && sentByCurrentUser}
                <form action="?/deleteMessage" method="POST" class="hidden group-hover:block">
                    <input type="hidden" name="message" value={message.id}>
                    <button class="absolute -top-3 -left-2 btn btn-xs btn-error">
                        <Icon name="trash-2" />
                    </button>
                </form>
            {/if}
            {#if message.deleted}
                <span class="italic text-gray-700"
                    >This message has been deleted</span
                >
            {:else}
                {message.content}
            {/if}
            {#if !message.deleted && !sentByCurrentUser}
                <form action="?/deleteMessage" method="POST" class="hidden group-hover:block">
                    <input type="hidden" name="message" value={message.id}>
                    <button class="absolute -top-3 -right-2 btn btn-xs btn-error">
                        <Icon name="trash-2" />
                    </button>
                </form>
            {/if}
        </div>
    </div>
    <div class="chat-footer opacity-80">
        {displayTime}
    </div>
</div>
