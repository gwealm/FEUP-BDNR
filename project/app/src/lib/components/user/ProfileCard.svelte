<script lang="ts">
    import { fly } from 'svelte/transition';
    import { visibleProfile, hideProfile } from '$lib/stores/profileCard';
    import { get } from 'svelte/store';
    import Icon from "../Icon.svelte";

    export let userId: string;
    export let userName: string;
    export let userImage: string;

    let profileCard: HTMLElement;

    $: if (profileCard && get(visibleProfile) === userId) {
        const cardBounds = profileCard.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        let top, left;

        if (clickedElementBounds.top + cardBounds.height > viewportHeight) {
            top = clickedElementBounds.top - cardBounds.height;
        } else {
            top = clickedElementBounds.top + clickedElementBounds.height;
        }

        if (clickedElementBounds.left + cardBounds.width > viewportWidth) {
            left = clickedElementBounds.left - cardBounds.width;
        } else {
            left = clickedElementBounds.right;
        }

        profileCard.style.top = `${top}px`;
        profileCard.style.left = `${left}px`;
    }

    function closeProfile() {
        hideProfile();
    }
</script>

<style>
    .profile-card {
        position: fixed;
        z-index: 1000;
        max-width: 20rem;
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

{#if $visibleProfile === userId}
    <div bind:this={profileCard} class="profile-card card w-96 glass" transition:fly>
        <button class="close-btn btn-primary" on:click={closeProfile}>
            <Icon name="x" />
        </button>
        <figure>
            <img src={userImage ?? "/unknown_user.png"} alt={`Profile picture for ${userName}`} />
        </figure>
        <div class="card-body">
            <h2 class="card-title">{userName}</h2>
            <div class="card-actions justify-end">
                <a href={`/user/${userName}`} class="btn btn-primary">View Profile</a>
            </div>
        </div>
    </div>
{/if}
