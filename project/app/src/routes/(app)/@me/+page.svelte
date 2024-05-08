<script>
  // Import any necessary modules here
</script>

<svelte:head>
  <title>Profile Page</title>
</svelte:head>

<main class="p-6">
  <div class="flex items-center space-x-4 mb-6">
    <img src="https://via.placeholder.com/50" alt="Avatar" class="w-12 h-12 rounded-full">
    <div>
      <h1 class="text-2xl font-bold">Username</h1>
      <p class="text-gray-500">Status: Online</p>
    </div>
  </div>
  
  <div class="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-lg font-bold mb-4">About Me</h2>
    <p>Boas pessoal</p>
  </div>

  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-lg font-bold mb-4">Recent Activity</h2>
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

<style>
  /* Add any custom styles here */
</style>
