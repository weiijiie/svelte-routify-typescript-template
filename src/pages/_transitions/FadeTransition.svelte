<script>
    import { fade } from "svelte/transition";
    import { BaseTransition } from "@sveltech/routify/decorators";
    const configs = [
        {
            // Just do a simple fade for all cases
            condition: () => true,
            transition: fade,
            outParams: { duration: 0 },
            inParams: { duration: 250 }
        }
    ];
</script>

<BaseTransition {configs}>
    <slot />
</BaseTransition>
