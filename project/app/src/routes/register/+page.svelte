<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import { browser } from "$app/environment";

    export let form;

    let imagePreviewUrl: string | ArrayBuffer | null = null;

    function updateImagePreview(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewUrl = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
</script>

<svelte:head>
    <title>Register</title>
</svelte:head>

<div
    class="flexse min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
>
    <div class="w-full max-w-md space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Register your account
            </h2>
        </div>
        <form
            method="POST"
            class="mt-8 space-y-6"
            use:enhance
            enctype="multipart/form-data"
        >
            <input type="hidden" name="register" value="true" />
            <div class="flex flex-col items-center">
                <div
                    class="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-gray-300 shadow-lg"
                >
                    <img
                        src={imagePreviewUrl || "https://placehold.it/100x100"}
                        alt="Profile picture preview"
                        class="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <label
                        for="image"
                        class="btn btn-primary cursor-pointer text-white"
                    >
                        Upload Profile Picture
                        <input
                            type="file"
                            id="image"
                            name="image"
                            class="sr-only"
                            accept="image/*"
                            on:change={updateImagePreview}
                        />
                    </label>
                </div>
            </div>
            <div class="rounded-md shadow-sm">
                <div>
                    <label for="username" class="sr-only">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Username"
                    />
                    {#if form?.errors?.username}
                        <p class="text-red-500">
                            {form.errors.username}
                        </p>
                    {/if}
                </div>
                <div>
                    <label for="email" class="sr-only">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        required
                        class="relative block w-full appearance-none border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Email address"
                    />
                    {#if form?.errors?.email}
                        <p class="text-red-500">
                            {form.errors?.email}
                        </p>
                    {/if}
                </div>
                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="new-password"
                        required
                        class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Password"
                    />
                    {#if form?.errors?.password}
                        <p class="text-red-500">
                            {form.errors?.password}
                        </p>
                    {/if}
                </div>
                <div>
                    <label for="password_confirm" class="sr-only"
                        >Confirm Password</label
                    >
                    <input
                        id="password_confirm"
                        name="password_confirm"
                        type="password"
                        required
                        class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Confirm Password"
                    />
                    {#if form?.errors?.password_confirm}
                        <p class="text-red-500">
                            {form.errors?.password_confirm}
                        </p>
                    {/if}
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Register
                </button>
                {#if form?.errors?.general}
                    <p class="mt-2 text-center text-red-500">
                        {form.errors?.general}
                    </p>
                {/if}
            </div>
        </form>
    </div>
</div>
