<script lang="ts">
    import { Page } from "../classLibrary/Page";
    import Nav from "./_components/Nav.svelte";
    import FadeTransition from "./_transitions/FadeTransition.svelte";

    const links: Page[] = [
        { name: "Home", path: "/index" },
        { name: "About", path: "./about" }
    ];
</script>

<style>
    .nav {
        position: fixed;
        left: 0;
        right: 0;
    }
    main {
        height: calc(100% - 100px);
        padding-top: 100px;
    }
</style>

<div class="nav">
    <Nav {links} />
</div>
<main>
    <slot decorator={FadeTransition} />
</main>
