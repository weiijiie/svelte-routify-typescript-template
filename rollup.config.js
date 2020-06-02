import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import replace from '@rollup/plugin-replace';
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { workboxGenerateSW } from "./plugins/rollup-plugin-workbox"
const svelteOptions = require("./svelte.config.js");

const production = !process.env.ROLLUP_WATCH;
const legacy = !!process.env.LEGACY_BUILD;

const output = legacy
    ? {
        sourcemap: true,
        format: "system",
        dir: "dist/legacy"
    }
    : {
        sourcemap: true,
        format: "esm",
        dir: "dist"
    };

export default {
    input: "src/main.js",
    output,
    plugins: [
        del({
            targets: ["dist/*"],
            runOnce: true
        }),
        copy({
            targets: [{ src: "public/**/*", dest: "dist" }]
        }),
        svelte(svelteOptions),
        replace({
            __PRODUCTION: production
        }),
        resolve({
            browser: true,
            dedupe: (importee) =>
                importee === "svelte" || importee.startsWith("svelte/")
        }),
        commonjs(),
        legacy && babel({
            babelHelpers: "runtime",
            extensions: [".js", ".mjs", ".html", ".svelte"],
            exclude: ["node_modules/@babel/**", "node_modules/core-js/**"]
        }),
        !legacy && production && workboxGenerateSW({
            swDest: "dist/service-worker.js",
            globDirectory: "dist",
            globPatterns: ["**/*.{html,css,js,json,png,jpg,jpeg,svg}"],
            globIgnores: ["**/legacy/*"],
            skipWaiting: true,
            clientsClaim: true
        }),
        // Call `npm run start` once bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the browser upon changes
        !production && livereload("dist"),

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
