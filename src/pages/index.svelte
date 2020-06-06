<script lang="ts">
    import Features from "./_components/Features.svelte";

    declare let __production: boolean;

    if (!__production) {
        console.log("Running in development");
    }

    let features: string[] = [
        "Typescript",
        "SASS/SCSS",
        "Babel",
        "Tree-Shaking",
        "Code-Splitting",
        "PWA",
        "Routing"
    ];
</script>

<style lang="scss">
    $base-color: #ff3e00;

    div {
        text-align: center;
        padding: 1em;
        max-width: 500px;
        margin: 0 auto;
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

<div>
    <h1>{'Svelte with...'}</h1>
</div>
<Features {features} />
