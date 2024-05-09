<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    const { user } = data;
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
                <p class="text-gray-500">Status: Online</p>
            </div>
        </div>

        <div class="mb-6 rounded-lg bg-white p-6 shadow-md">
            <h2 class="mb-4 text-lg font-bold">About Me</h2>
            <p>Boas pessoal</p>
        </div>

        <div class="rounded-lg bg-white p-6 shadow-md">
            <h2 class="mb-4 text-lg font-bold">Recent Activity</h2>
            <!-- Display recent activity such as messages, calls, etc. -->
            <ul>
                <li class="flex items-center space-x-2">
                    <span class="text-gray-500">May 8, 2024</span>
                    <span class="text-gray-500">•</span>
                    <span class="text-gray-500">Sent a message:</span>
                    <p class="text-gray-700">Hello there!</p>
                </li>
                <!-- Add more recent activity items here -->
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
