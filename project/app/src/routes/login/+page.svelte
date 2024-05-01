<script lang="ts">
    import { enhance } from "$app/forms";
    /* import type { ActionData } from "./$types"; */

    /* export let form: ActionData; */
</script>

<form method="POST" use:enhance >
    <label>
        Email
        <input type="email" name="email" id="email" required />
    </label>
    <label>
        Password
        <input type="password" name="password" id="password" required />
    </label>
    <!-- {#if form?.invalid}<p class="error">Invalid credentials</p>{/if} -->
    <input type="submit" value="Submit" />
</form>
