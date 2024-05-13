<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import type { PageData } from "./$types.js";
    import { enhance } from '$app/forms';

    export let data: PageData;

    export let form;

    const { me, user, servers, messages } = data;

    const isMe = me.username === user.username;

    let showDeleteForm = false;

    $: toggleDeleteForm = () => {
        showDeleteForm = !showDeleteForm;
    };
</script>

<svelte:head>
    <title>Profile Page - {user.username}</title>
</svelte:head>

{#if user}
    <main class="p-6">
        <div class="mb-6 flex items-center space-x-4">
            <img
                src={user.image ?? "https://via.placeholder.com/50"}
                alt="Profile picture for {user.username}"
                class="avatar h-12 w-12 rounded-full"
            />
            <div>
                <h1 class="text-2xl font-bold">{user.username}</h1>
                <p class="font-bold text-gray-500">
                    Status:
                    <span
                        class={user.online ? "text-green-500" : "text-red-500"}
                    >
                        {user.online ? "Online" : "Offline"}
                    </span>
                </p>
            </div>
            {#if isMe}
                <button class="btn btn-error" on:click={toggleDeleteForm}>
                    Delete Profile {showDeleteForm}
                </button>
            {/if}
        </div>

        {#if showDeleteForm}
            <form method="POST" action="?/deleteuser" use:enhance class="mb-6 space-y-4">
                <div class="form-control">
                    <label class="label" for="password">
                        <span class="label-text">Confirm Password</span>
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        class="input input-bordered"
                        required
                    />
                </div>
                {#if form?.error}
                    <div class="alert alert-error">
                        <div>
                            <Icon name="alert-circle" />
                            <span>{form.error}</span>
                        </div>
                    </div>
                {/if}
                <div class="form-control">
                    <button type="submit" class="btn btn-primary">
                        Confirm Delete
                    </button>
                </div>
            </form>
        {/if}

        <div class="stats mb-6 shadow">
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="inline-block h-8 w-8 stroke-current"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <div class="stat-title">Servers Joined</div>
                <div class="stat-value">{Object.keys(user.servers).length}</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="inline-block h-8 w-8 stroke-current"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        ></path>
                    </svg>
                </div>
                <div class="stat-title">Messages Sent</div>
                <div class="stat-value">{messages.length}</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="inline-block h-8 w-8 stroke-current"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        ></path>
                    </svg>
                </div>
                <div class="stat-title">Member Since</div>
                <div class="stat-value">
                    <time datetime={new Date(user.register_date).toISOString()}>
                        {new Date(user.register_date).toLocaleDateString()}
                    </time>
                </div>
            </div>
        </div>

        <!-- Server List -->
        <div class="mt-6">
            <h2 class="mb-4 text-lg font-semibold">
                {isMe ? "Your" : user.username} Servers:
            </h2>
            <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {#each servers as server}
                    <li
                        class="rounded-lg border border-gray-200 bg-white p-4 shadow-xl hover:bg-gray-50"
                    >
                        <a
                            href={`/${server.id}`}
                            class="block font-medium text-blue-700 hover:text-blue-900"
                        >
                            {server.name}
                        </a>
                        <p class="text-sm text-gray-600">
                            {server.description ?? "Such empty..."}
                        </p>
                    </li>
                {/each}
            </ul>
        </div>
    </main>
{:else}
    <section class="flex h-full items-center justify-center p-4">
        <div
            class="flex max-w-lg items-center space-x-4 rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        >
            <div class="flex-shrink-0">
                <Icon name="alert-triangle" />
            </div>
            <div>
                <span class="text-lg font-bold">Oops!</span>
                <span>Please log in to send messages.</span>
            </div>
            <a href="/login" class="text-red-500 hover:underline">Login</a>
        </div>
    </section>
{/if}
