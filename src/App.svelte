<script lang="ts">
    const svelte: string = "Svelte";
    const typescript: string = "Typescript";

    const plus = (first: string, second: string): string =>
        `${first} plus ${second}!`;
</script>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
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
    <h1>{plus(svelte, typescript)}</h1>
</main>
