import { generateSW } from "workbox-build"


function workboxGenerateSW(options, callback) {
    return {
        name: "workbox",
        writeBundle(outputOptions, bundle) {
            generateSW({
                ...options,
            }).then(callback);
        }
    }
}

export { workboxGenerateSW }