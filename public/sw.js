const CACHE_NAME = "amara-colors-v8";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./coloring/animals/cat.png",
  "./coloring/animals/dog.png",
  "./coloring/dinosaurs/dino.svg",
  "./coloring/unicorns/unicorn.png",
  "./coloring/fantasy/star.svg",
  "./coloring/food/ice-cream.png",
  "./coloring/sea/fish.png",
  "./coloring/space/rocket.png",
  "./backgrounds/forest.png",
  "./backgrounds/meadow.png",
  "./backgrounds/jungle.png",
  "./backgrounds/rainbow-meadow.png",
  "./backgrounds/starry-sky.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
