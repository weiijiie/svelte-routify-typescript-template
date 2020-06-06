import App from "./App.svelte";
import { registerSW } from "./register-sw.js";

const app = new App({
    target: document.body
});

registerSW();

export default app;
