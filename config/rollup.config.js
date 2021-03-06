import path from "path";
import svelte from "rollup-plugin-svelte";
import { routify } from "@sveltech/routify"
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from '@rollup/plugin-typescript';
import babel from "@rollup/plugin-babel";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import replace from '@rollup/plugin-replace';
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { workboxGenerateSW } from "./plugins/workboxPlugin"
const svelteOptions = require("../svelte.config.js");


const production = !process.env.ROLLUP_WATCH;
const legacy = !!process.env.LEGACY_BUILD;

const distDir = "dist";
const buildDir = `${distDir}/${legacy ? "legacy" : "build"}`


const preloadFiles = [];

function generateSWCallback({ filePaths, count, size }) {
    console.log(`Service worker generated. ${count} files with total size ${size} bytes will be precached.`);
}

export default {
    input: "src/main.ts",
    output: {
        sourcemap: true,
        format: legacy ? "system" : "esm",
        dir: buildDir
    },
    plugins: [
        !legacy && del({
            targets: [`${distDir}/*`],
            runOnce: true
        }),
        copy({
            targets: [{ src: ["public/**/*", "!public/index.html"], dest: distDir }],
            copyOnce: true
        }),
        routify({
            singleBuild: production,
            dynamicImports: true
        }),
        svelte(svelteOptions),
        replace({
            __production: production
        }),
        resolve({
            browser: true,
            dedupe: (importee) =>
                importee === "svelte" || importee.startsWith("svelte/")
        }),
        commonjs(),
        typescript(),
        legacy && babel({
            configFile: path.resolve(__dirname, "babel.config.json"),
            babelHelpers: "runtime",
            extensions: [".js", ".mjs", ".ts", ".html", ".svelte"],
            exclude: ["node_modules/@babel/**", "node_modules/core-js/**"]
        }),
        !legacy && production && workboxGenerateSW({
            swDest: `${distDir}/service-worker.js`,
            globDirectory: distDir,
            globPatterns: ["**/*.{html,css,js,json,png,jpg,jpeg,svg}"],
            globIgnores: ["**/legacy/*"],
            skipWaiting: true,
            clientsClaim: true
        }),
        copy({
            targets: [{ src: "public/index.html", dest: distDir }],
            copyOnce: true
        }),
        // Call `npm run start` once bundle has been generated
        !production && serve(),

        // Watch the dist directory and refresh the browser upon changes
        !production && livereload(distDir),

        // If we're building for production (`npm run build`
        // instead of `npm run dev`), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    },
    preserveEntrySignatures: false,
    manualChunks
};

function manualChunks(id) {
    if (id.includes("node_modules")) {
        const directories = id.split(path.sep);
        const name = directories[directories.lastIndexOf('node_modules') + 1];

        if (name === "svelte" || name === "@sveltech") return;

        return "vendor";
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
