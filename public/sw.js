/* eslint-disable no-undef */
// COTI PWA Service Worker — cache-first for images, network-first for pages

const CACHE_VERSION = "coti-v1";
const STATIC_CACHE = `coti-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `coti-images-${CACHE_VERSION}`;
const PAGES_CACHE = `coti-pages-${CACHE_VERSION}`;

const CRITICAL_ASSETS = [
  "/",
  "/categorias",
  "/pracas",
  "/checklist",
  "/manifest.webmanifest",
];

// ─── Install ───────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(CRITICAL_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ──────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  const validCaches = [STATIC_CACHE, IMAGE_CACHE, PAGES_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((n) => !validCaches.includes(n))
            .map((n) => caches.delete(n))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── Offline fallback HTML ─────────────────────────────────────────────────
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Sem Conexao - COTI Restaurante</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;min-height:100dvh;display:flex;align-items:center;justify-content:center;background:#F5F0E8;color:#1a1a1a;padding:1rem}
    .card{text-align:center;padding:2rem 1.5rem;background:#fff;border-radius:1.5rem;box-shadow:0 4px 16px rgba(0,0,0,.08);max-width:380px;width:100%}
    h1{color:#1E3A5F;font-size:1.5rem;margin-bottom:.75rem}
    p{color:#555;line-height:1.6;margin-bottom:1.5rem}
    a{display:inline-block;color:#fff;background:#1E3A5F;text-decoration:none;padding:.875rem 2rem;border-radius:.75rem;font-weight:600;font-size:1rem}
    a:hover{opacity:.85}
  </style>
</head>
<body>
  <div class="card">
    <h1>Sem Conexao</h1>
    <p>Voce esta offline. Verifique sua conexao e tente novamente.</p>
    <a href="/">Tentar Novamente</a>
  </div>
</body>
</html>`;

// ─── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;

  // Next.js bundles: stale-while-revalidate
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fresh = fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
          return cached || fresh;
        })
      )
    );
    return;
  }

  // Images (incl. Supabase Storage): cache-first
  if (
    request.destination === "image" ||
    /\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request)
            .then((res) => {
              if (res.ok) cache.put(request, res.clone());
              return res;
            })
            .catch(() => new Response("", { status: 404 }));
        })
      )
    );
    return;
  }

  // Page navigation: network-first, offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            caches
              .open(PAGES_CACHE)
              .then((c) => c.put(request, res.clone()))
              .catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then(
              (cached) =>
                cached ||
                new Response(OFFLINE_HTML, {
                  headers: { "Content-Type": "text/html;charset=utf-8" },
                })
            )
        )
    );
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const fresh = fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        });
        return cached || fresh;
      })
    )
  );
});
