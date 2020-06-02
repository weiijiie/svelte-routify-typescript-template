const sveltePreprocess = require("svelte-preprocess");

const legacy = !!process.env.LEGACY_BUILD;

module.exports = {
    // enable run-time checks when not in production
    dev: !process.env.ROLLUP_WATCH,
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css: (css) => {
        css.write(legacy ? "dist/legacy/bundle.css" : "dist/bundle.css");
    },
    preprocess: sveltePreprocess({
        // Can use <... lang="ts"> in place of <... lang="typescript">
        aliases: [["ts", "typescript"]]
    })
};
