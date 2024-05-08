<script lang="ts">
    import "./style.css";

    import "$lib/service/db";
</script>

<main class="flex h-full">
    <slot />

  <footer class="absolute bottom-0 w-full py-4 text-center text-gray-500">
    <p>Watermark: OurName</p>
  </footer>

</main>
