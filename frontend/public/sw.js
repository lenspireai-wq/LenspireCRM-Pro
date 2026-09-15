// One-time service-worker retirement release.
// Older versions cached live CRM pages and could trap mobile users on stale
// offline content.  This worker deliberately handles no fetches: it clears
// those caches, releases control of pages, and then removes itself.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith("lenspirecrm-")).map((key) => caches.delete(key)));
      const clients = await self.clients.matchAll({ type: "window" });
      await self.registration.unregister();
      await Promise.all(clients.map((client) => client.navigate(client.url)));
    })(),
  );
});
