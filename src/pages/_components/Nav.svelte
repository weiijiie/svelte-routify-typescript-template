<script lang="ts">
    import { url, isActive } from "@sveltech/routify";
    export let links: {}[];
</script>

<style lang="scss">
    $lighter: lighter(#ff3e00);

    nav {
        display: flex;
    }

    nav div {
        margin: auto;
        padding: 16px;
        border-radius: 3px;
        background: white;
        box-shadow: 0px 5px 10px 5px rgba(0, 0, 0, 0.075);
    }

    a {
        padding: 0 16px;
        width: 64px;
    }

    .active {
        text-decoration: underline $base;
    }
</style>

<nav>
    <div>
        {#each links as { name, path }}
            <a href={$url(path)} class:active={$isActive(path)}>{name}</a>
        {/each}
    </div>
</nav>
