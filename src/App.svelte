<script lang="ts">
    import Features from "./Features.svelte";

    declare var __PRODUCTION: boolean;

    if (!__PRODUCTION) {
        console.log("Running in development");
    }

    const features: string[] = [
        "Typescript",
        "SASS/SCSS",
        "Babel",
        "Tree-Shaking",
        "Code-Splitting"
    ];
</script>

<style lang="scss">
    $base-color: #ff3e00;

    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    main :global(li) {
        color: $base-color;
        text-transform: uppercase;
        font-size: 3em;
        font-weight: 100;
    }

    h1 {
        color: $base-color;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

<main>
    <h1>{'Svelte with...'}</h1>
    <Features {features} />
</main>
