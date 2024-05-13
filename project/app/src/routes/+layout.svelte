<script lang="ts">
    import NotificationDisplay from "$lib/components/notifications/NotificationDisplay.svelte";

    import "./style.css";
</script>

<NotificationDisplay />
<main class="flex h-full">
    <slot />
</main>

<!-- <footer class="absolute bottom-0 w-full py-4 text-center text-gray-500">
    <p>Watermark: OurName</p>
</footer>
 -->
