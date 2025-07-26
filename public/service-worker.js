const CACHE_NAME = "skywatch-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/sun.png",
];

self.addEventListener("install", (event) => {
  console.log("✅ SW instalado");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (let url of urlsToCache) {
        try {
          await cache.add(url);
          console.log(`✅ Cacheado: ${url}`);
        } catch (err) {
          console.warn(`⚠️ No se pudo cachear ${url}`, err);
        }
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("✅ SW activado");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log(`🗑 Eliminando cache viejo: ${name}`);
            return caches.delete(name);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((networkResponse) => {
          
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(
            () =>
              new Response(
                "⚠️ Estás sin conexión y este recurso no está en cache.",
                { status: 503 }
              )
          )
      );
    })
  );
});
