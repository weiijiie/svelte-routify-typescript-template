import App from "./App.svelte";
import HMR from "@sveltech/routify/hmr"
import { registerSW } from "./register-sw.js";

const app = __production
    ? new App({ target: document.body })
    : HMR(App, { target: document.body }, 'svelte-template')

registerSW();

export default app;
