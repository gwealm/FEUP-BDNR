<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    import ServerList from "$lib/components/server/list.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;

    const { servers, user } = data;
</script>

<section class="scrollbar-hide flex w-16 flex-col items-center gap-2 overflow-visible py-2" id="server-list">
    <!-- TODO: This should be factored out into a component that also has a list of DMs (if those are added) -->
    <div class="dropdown dropdown-right">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="h-12 w-12 rounded-xl">
                <img
                    src="/favicon.png"
                    alt="Image for {'@me'}"
                    class="rounded-xl transition-all duration-100 ease-in-out hover:bg-blue-300"
                />
            </div>
        </div>
        <ul
            class="menu menu-sm z-10 dropdown-content bg-base-100 rounded-box ml-3 w-52 p-2 shadow"
        >
            <li>
                <a class="justify-between" href="/@me">
                    Profile
                </a>
            </li>
            <li><a href="/logout">Logout</a></li>
        </ul>
    </div>
    <div class="divider mx-1 mb-0 mt-0 h-1 rounded bg-white" />
    <ServerList {servers} />

    <div class="mb-2 mt-auto">
        <a href="/logout">
            <Icon name="log-out" height="2em" width="2em" />
        </a>
    </div>
</section>
<section class="flex flex-1 bg-zinc-700" id="server-content">
    <slot />
</section>
