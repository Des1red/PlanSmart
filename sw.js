const CACHE_STATIC = "plansmart-static-v3";
const CACHE_DYNAMIC = "plansmart-dynamic-v3";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/main.js",
  "./favicon.png"
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
    )
  );

});

self.addEventListener("fetch", (event) => {

  event.respondWith(

    caches.match(event.request).then(cached => {

      if (cached) return cached;

      return fetch(event.request).then(res => {

        const clone = res.clone();

        caches.open(CACHE_DYNAMIC).then(cache => {
          cache.put(event.request, clone);
        });

        return res;

      }).catch(() => {

        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }

      });

    })

  );

});