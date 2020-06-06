<script lang="ts">
    import { fly } from "svelte/transition";
    import { beforeUrlChange } from "@sveltech/routify";

    export let features: string[];

    function shift() {
        if (features.length > 0) {
            features = [...features.slice(1), features[0]];
        }
    }

    let interval: number = setInterval(shift, 1800);

    $beforeUrlChange(() => {
        clearInterval(interval);
        return true;
    });
</script>

<style>
    section {
        display: flex;
        align-items: stretch;
        justify-content: center;
    }

    ol {
        list-style: none;
        padding: 0;
        text-align: center;
    }

    li {
        position: relative;
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 3em;
        font-weight: 100;
    }
</style>

<section>
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
</section>
