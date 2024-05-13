<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { onMount } from "svelte";

    export let form: ActionData;

    let rememberMe = false;

    onMount(() => {
        rememberMe = localStorage.getItem('remember_me') === 'true';
    });

    function updateRememberMe(value) {
        localStorage.setItem('remember_me', value);
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div
    class="flexse min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
>
    <div class="w-full max-w-md space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
            </h2>
        </div>
        <form method="POST" class="mt-8 space-y-6" use:enhance>
            <input type="hidden" name="remember" value="true" />
            <div class="-space-y-px rounded-md shadow-sm">
                <div>
                    <label for="identifier" class="sr-only">Email address</label
                    >
                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        autocomplete="email"
                        required
                        class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Email address or Username"
                    />
                </div>
                {#if form?.errors?.identifier}
                    <p class="text-xs italic text-red-500">
                        {form?.errors?.identifier}
                    </p>
                {/if}
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        required
                        class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-white placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Password"
                    />
                </div>
                {#if form?.errors?.password}
                    <p class="text-xs italic text-red-500">
                        {form?.errors?.password}
                    </p>
                {/if}
            </div>

            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <input
                        id="remember_me"
                        name="remember_me"
                        bind:checked={rememberMe}
                        on:change={() => updateRememberMe(rememberMe)}
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                        for="remember_me"
                        class="ml-2 block text-sm text-gray-900"
                    >
                        Remember me
                    </label>
                </div>
                <a href="/register">Create an account</a>
            </div>

            <div>
                <button
                    type="submit"
                    class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <span
                        class="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                        <!-- Heroicon name: solid/lock-closed -->
                        <svg
                            class="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                                clip-rule="evenodd"
                            />
                            <path
                                fill-rule="evenodd"
                                d="M4 8V6a4 4 0 118 0v2h1a3 3 0 013 3v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a3 3 0 013-3h1zm6-2a2 2 0 00-4 0v2h4V6z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </span>
                    Sign in
                </button>
                <a href="/register">
                    <button
                        type="submit"
                        class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-4"
                        >
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                            <svg 
                                class="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                                fill="currentColor" 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 310 310"
                                aria-hidden="true"
                            >
                                <path d="M300.606,159.727l-45.333-45.333c-5.857-5.858-15.355-5.858-21.213,0L225,123.454V15c0-8.284-6.716-15-15-15H20
                                   C11.716,0,5,6.716,5,15v240.002c0,8.284,6.716,15,15,15h85V295c0,8.284,6.716,15,15,15h45.333c3.979,0,7.794-1.581,10.607-4.394
                                   l124.667-124.667C306.465,175.081,306.465,165.585,300.606,159.727z M35,30h160v123.454l-85.606,85.605
                                   c-0.302,0.301-0.581,0.619-0.854,0.942H35V30z M159.12,280H135v-24.121l109.667-109.666l24.12,24.12L159.12,280z"/>
                            </svg>
                        </span>
                        Register
                    </button>
                </a>
                {#if form?.errors?.general}
                <p class="mt-2 text-center text-red-500">
                    {form?.errors?.general}
                </p>
                {/if}
            </div>
        </form>
    </div>
</div>
