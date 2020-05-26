import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import livereload from "rollup-plugin-livereload";
import svelteOptions from "./svelte.config";
import babelOptions from "./babel.config.json";

const production = !process.env.ROLLUP_WATCH;

async function moduleConfig() {
    return {
        input: "src/main.js",
        output: {
            sourcemap: true,
            format: "esm",
            dir: "public/build/module"
        },
        plugins: [
            ...basePlugins(),
            // Call `npm run start` once bundle has been generated
            !production && serve(),

            // Watch the `public` directory and refresh the browser upon changes
            !production && livereload("public"),

            // If we're building for production (`npm run build`
            // instead of `npm run dev`), minify
            production &&
                (await import("rollup-plugin-terser")).terser({
                    ecma: 8,
                    safari10: true
                })
        ],
        watch: {
            clearScreen: false
        }
    };
}

async function nomoduleConfig() {
    const config = {
        input: "src/main.js",
        output: {
            sourcemap: true,
            format: "system",
            dir: "public/build/nomodule"
        },
        plugins: [
            ...basePlugins({ nomodule: true }),
            // Call `npm run start` once bundle has been generated
            !production && serve(),

            // Watch the `public` directory and refresh the browser upon changes
            !production && livereload("public"),

            // If we're building for production (`npm run build`
            // instead of `npm run dev`), minify
            production && (await import("rollup-plugin-terser")).terser()
        ],
        watch: {
            clearScreen: false
        }
    };
    return config;
}

const configs = [moduleConfig()];
if (production) {
    configs.push(nomoduleConfig());
}

export default Promise.all(configs);

function basePlugins({ nomodule = false } = {}) {
    const babelOpts = nomodule
        ? babelOptions.env.nomodule
        : babelOptions.env.module;

    return [
        svelte(svelteOptions),
        resolve({
            browser: true,
            dedupe: (importee) =>
                importee === "svelte" || importee.startsWith("svelte/")
        }),
        commonjs(),
        babel({
            babelHelpers: "runtime",
            extensions: [".js", ".mjs", ".html", ".svelte"],
            exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],
            ...babelOpts
        })
    ];
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
