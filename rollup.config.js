import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
const svelteOptions = require("./svelte.config.js");

const production = !process.env.ROLLUP_WATCH;
const legacy = !!process.env.LEGACY_BUILD;

const output = legacy
    ? {
        sourcemap: true,
        format: "system",
        dir: "public/build/legacy"
    }
    : {
        sourcemap: true,
        format: "esm",
        dir: "public/build"
    };

export default {
    input: "src/main.js",
    output,
    plugins: [
        svelte(svelteOptions),
        resolve({
            browser: true,
            dedupe: (importee) =>
                importee === "svelte" || importee.startsWith("svelte/")
        }),
        commonjs(),
        legacy &&
        babel({
            babelHelpers: "runtime",
            extensions: [".js", ".mjs", ".html", ".svelte"],
            exclude: ["node_modules/@babel/**", "node_modules/core-js/**"]
        }),

        // Call `npm run start` once bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the browser upon changes
        !production && livereload("public"),

        // If we're building for production (`npm run build`
        // instead of `npm run dev`), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    },
    preserveEntrySignatures: false
};

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require("child_process").spawn(
                    "npm",
                    ["run", "start", "--", "--dev"],
                    {
                        stdio: ["ignore", "inherit", "inherit"],
                        shell: true
                    }
                );
            }
        }
    };
}
