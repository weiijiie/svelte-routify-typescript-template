<script lang="ts">
    import { fly } from "svelte/transition";

    export let features: string[];

    function shift() {
        if (features.length > 0) {
            features = [...features.slice(1), features[0]];
        }
    }

    setInterval(shift, 1800);
</script>

<style>
    ol {
        list-style: none;
        padding: 0;
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
