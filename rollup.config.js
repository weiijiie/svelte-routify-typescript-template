import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { generateSW } from 'workbox-build';
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
        copy({
            targets: [{ src: 'public/**/*', dest: 'dist' }]
        }),
        svelte(svelteOptions),
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
        !legacy && workboxGenerateSW({
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

function workboxGenerateSW(options) {
    return {
        name: "workbox",
        writeBundle(outputOptions, bundle) {
            generateSW({
                ...options,
            }).then(({ count, size }) => {
                console.log(`Service worker generated at: ${options.swDest}. ${count} files totaling ${size} bytes will be precached.`);
            });
        }
    }
}

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
