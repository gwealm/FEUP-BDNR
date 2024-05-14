<script>
    import { goto } from "$app/navigation";
    import Icon from "$lib/components/Icon.svelte";
</script>

<svelte:head>
    <title>404 Not Found</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200 flex items-center justify-center">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <div class="flex justify-center items-center">
                <Icon width="8rem" height="8rem" name="user-x"/>
            </div>
            <p class="py-6">
                Oops! The <b>user</b> you are looking for <b>does not exist</b> anymore! 
            </p>
            <button class="btn btn-primary" on:click={() => goto("/")}
                >Go Home</button
            >
        </div>
    </div>
</div>
