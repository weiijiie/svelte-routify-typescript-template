import { generateSW } from "workbox-build"


function workboxGenerateSW(options) {
    return {
        name: "workbox",
        writeBundle(outputOptions, bundle) {
            generateSW({
                ...options,
            }).then(({ count, size }) => {
                console.log(`Service worker generated at: "${options.swDest}". ${count} files with total size ${size} bytes will be precached.`);
            });
        }
    }
}

export { workboxGenerateSW }