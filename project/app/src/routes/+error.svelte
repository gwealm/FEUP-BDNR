<script>
    import { goto } from "$app/navigation";
</script>

<svelte:head>
    <title>404 Not Found</title>
</svelte:head>

<div class="hero min-h-screen bg-base-200">
    <div class="text-center hero-content">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">404</h1>
            <p class="py-6">Oops! The page you are looking for has vanished into the ether.</p>
            <button class="btn btn-primary" on:click={() => goto('/')}>Go Home</button>
        </div>
    </div>
</div>
