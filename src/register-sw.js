function registerSW() {
    if (__production && 'serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function (registration) {
                    console.log('Service worker registered! 😎 Scope: ' + registration.scope);
                })
                .catch(function (err) {
                    console.log('Service worker registration failed! 😫', err.stack);
                })
        });
    }
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// TODO: Import deferredPrompt
export { registerSW, deferredPrompt };