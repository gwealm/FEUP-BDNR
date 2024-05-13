<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import type { PageData } from "../$types";

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

        <div class="stats shadow mb-6">
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="stat-title">Servers</div>
                <div class="stat-value">{Object.keys(user.servers).length}</div>
                <div class="stat-desc">User</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                </div>
                <div class="stat-title">Messages</div>
                <div class="stat-value">4,200</div>
                <div class="stat-desc">↗︎ 400 (22%)</div>
            </div>
            <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                </div>
                <div class="stat-title">New Registers</div>
                <div class="stat-value">1,200</div>
                <div class="stat-desc">↘︎ 90 (14%)</div>
            </div>
        </div>

        <!-- Server List -->
        <div class="mt-6">
            <h2 class="text-lg font-semibold mb-4">Your Servers</h2>
            <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each Object.entries(user.servers) as [serverName, serverDetails]}
                <li class="p-4 rounded-lg shadow-xl bg-white border border-gray-200 hover:bg-gray-50">
                    <a href={`/${serverName}`}
                       class="block text-blue-700 hover:text-blue-900 font-medium">
                        {serverName}
                    </a>
                    <p class="text-sm text-gray-600">{serverDetails.description}</p>
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
