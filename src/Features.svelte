<script lang="ts">
    import { fly } from "svelte/transition";

    export let features: string[];

    function shift() {
        let feature = features.shift();
        features = [...features, feature];
    }

    setInterval(shift, 1800);
</script>

<style>
    ol {
        list-style: none;
    }
</style>

<ol>
    {#each features as feature, i (feature)}
        {#if i === 0}
            <li
                out:fly={{ y: 75, duration: 500 }}
                in:fly={{ y: -75, duration: 500 }}>
                {feature}
            </li>
        {/if}
    {/each}
</ol>
