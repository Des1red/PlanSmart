const CACHE_STATIC = "plansmart-static-v8";
const CACHE_DYNAMIC = "plansmart-dynamic-v8";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/main.js",
  "./icons/favicon.png",
  "./icons/icon-192-v2.png",
  "./icons/icon-512-v2.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => ![CACHE_STATIC, CACHE_DYNAMIC].includes(k))
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );

});

self.addEventListener("fetch", (event) => {

  if (event.request.mode === "navigate") {

    event.respondWith(
      fetch(event.request)
        .then(res => {

          const clone = res.clone();
          caches.open(CACHE_STATIC).then(cache => {
            cache.put("./index.html", clone);
          });

          return res;

        })
        .catch(() => caches.match("./index.html"))
    );

    return;
  }

  event.respondWith(

    caches.match(event.request).then(cached => {

      if (cached) return cached;

      return fetch(event.request).then(res => {

        const clone = res.clone();

        caches.open(CACHE_DYNAMIC).then(cache => {
          cache.put(event.request, clone);
        });

        return res;

      });

    })

  );

});