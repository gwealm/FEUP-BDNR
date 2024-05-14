<script lang="ts">
    import type { Message } from "$lib/types";
    import { onMount } from "svelte";
    import type { Action } from "svelte/action";
    import { fly } from "svelte/transition";
    import {
        visibleProfile,
        showProfile,
        hideProfile,
    } from "$lib/stores/profileCard";
    import { get } from "svelte/store";
    import Icon from "../Icon.svelte";

    export let message: Message;
    export let sentByCurrentUser: boolean = false;
    export let userIsAdmin: boolean = false;
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

    let profileCard: HTMLElement;
    let clickedElementBounds;

    function toggleProfile(event: MouseEvent) {
        if (message.senderName.startsWith("DELETED_USER")) return;

        clickedElementBounds = (
            event.target as HTMLElement
        ).getBoundingClientRect();
        const currentVisibleProfile = get(visibleProfile);

        if (currentVisibleProfile === message.id) {
            hideProfile();
        } else {
            showProfile(message.id);
        }
    }

    function closeProfile() {
        hideProfile();
    }

    $: if (profileCard && get(visibleProfile) === message.id) {
        const cardBounds = profileCard.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        let top, left;

        if (clickedElementBounds.top + cardBounds.height > viewportHeight) {
            top = clickedElementBounds.top - cardBounds.height;
        } else {
            top = clickedElementBounds.top + clickedElementBounds.height;
        }

        if (sentByCurrentUser) {
            left = clickedElementBounds.left - cardBounds.width;
        } else {
            left = clickedElementBounds.right;
        }

        profileCard.style.top = `${top}px`;
        profileCard.style.left = `${left}px`;
    }
</script>

<div
    class:chat-start={!sentByCurrentUser}
    class:chat-end={sentByCurrentUser}
    class="chat relative"
    id={`message-${message.id}`}
    use:scroll
>
    <div
        class:online={isUserOnline}
        class:offline={!isUserOnline}
        class="avatar chat-image"
        on:click={toggleProfile}
    >
        <div class="w-10 rounded-full">
            <img
                alt={`Profile picture for ${message.senderName}`}
                src={message.senderImage ?? "/unknown_user.png"}
            />
        </div>
    </div>
    <div>
        <div
            class="chat-header text-sm font-bold"
            class:text-end={sentByCurrentUser}
        >
            {message.senderName}
        </div>
        <div
            class:chat-bubble-primary={sentByCurrentUser}
            class:chat-bubble-secondary={!sentByCurrentUser}
            class="chat-bubble group relative max-w-96 rounded-lg p-3"
            style="overflow-wrap: break-word;"
        >
            {#if !message.deleted && (sentByCurrentUser || userIsAdmin)}
                <form
                    action="?/deleteMessage"
                    method="POST"
                    class="hidden group-hover:block"
                >
                    <input type="hidden" name="message" value={message.id} />
                    <button
                        class="
                        absolute
                        -top-3
                        {sentByCurrentUser ? '-left-2' : '-right-2'} 
                        btn
                        btn-xs
                        btn-error"
                    >
                        <Icon name="trash-2" />
                    </button>
                </form>
            {/if}
            {#if message.deleted}
                <span class="italic text-gray-800"
                    >This message has been deleted</span
                >
            {:else}
                {message.content}
            {/if}
        </div>
    </div>
    <div class="chat-footer opacity-80">
        {displayTime}
    </div>
    {#if $visibleProfile === message.id}
        <div
            bind:this={profileCard}
            class="profile-card card glass w-96"
            transition:fly
        >
            <button class="close-btn btn-primary" on:click={closeProfile}>
                <Icon name="x" />
            </button>
            <figure>
                <img
                    src={message.senderImage ?? "/unknown_user.png"}
                    alt={`Profile picture for ${message.senderName}`}
                />
            </figure>
            <div class="card-body">
                <h2 class="card-title">{message.senderName}</h2>
                <div class="card-actions justify-end">
                    <a
                        href={`/user/${message.senderName}`}
                        class="btn btn-primary">View Profile</a
                    >
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .profile-card {
        position: fixed;
        z-index: 1000;
        max-width: 20rem; /* Smaller size */
    }

    .avatar.chat-image:hover {
        cursor: pointer;
        transform: scale(1.1);
        transition: transform 0.2s;
    }

    .close-btn {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
    }
</style>
