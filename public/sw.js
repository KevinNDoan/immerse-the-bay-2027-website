// Keeps the /pamphlet overview and its PDF readable with no signal. Registered by
// src/app/pamphlet/OfflineStatus.tsx. Its scope is the whole site so it can answer the PDF download too, but it
// only ever answers two pages, /pamphlet and /zap-pamphlet.pdf, plus the static files the pamphlet saved.
// Every other request, including the landing page itself, goes straight to the network.
//
// Pages: network first, with a short timeout, then the saved copy. A good copy is only saved when it really is
// the pamphlet (not a Wi-Fi login page), and a server error counts as no signal.
// Static files: the saved copy if there is one, refreshed in the background. The page lists what to keep after
// each visit, and anything not on that list is dropped, so the cache never grows past one version.

const CACHE = "zap-pamphlet";
const PAGE = "/pamphlet";
const PDF = "/zap-pamphlet.pdf";
const PAGE_TIMEOUT_MS = 3000;
/** The pamphlet's root element, used to tell the real page from a portal or proxy page. */
const PAGE_MARKER = 'class="doc"';
/** Only these kinds of files are worth keeping: hashed build output, images, the icon. Never RSC payloads. */
const KEEP = [/^\/_next\/static\//, /^\/_next\/image\?/, /^\/art\//, /^\/icon\.png/];

const keepable = (url) => url.origin === self.location.origin && !url.searchParams.has("_rsc") && KEEP.some((re) => re.test(url.pathname + url.search));

self.addEventListener("install", (event) => {
  // Best effort: a failing PDF route must not stop the worker installing.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.all([PAGE, PDF].map((u) => cache.add(u).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("zap-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// The page sends the files it loaded. Save the keepable ones, drop everything older, then say so.
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "zap-cache" || !Array.isArray(data.urls)) return;
  const wanted = new Set();
  for (const u of data.urls) {
    try {
      const url = new URL(u, self.location.origin);
      if (keepable(url)) wanted.add(url.href);
    } catch {
      // not a URL
    }
  }
  const pages = new Set([PAGE, PDF].map((p) => new URL(p, self.location.origin).href));
  event.waitUntil(
    caches
      .open(CACHE)
      .then(async (cache) => {
        await Promise.all([...wanted].map((u) => cache.add(u).catch(() => undefined)));
        await Promise.all([...pages].map((u) => cache.add(u).catch(() => undefined)));
        const saved = await cache.keys();
        await Promise.all(saved.filter((r) => !wanted.has(r.url) && !pages.has(r.url)).map((r) => cache.delete(r)));
      })
      // Only claim "available offline" when the page and the PDF really are saved.
      .then(async () => {
        const cache = await caches.open(CACHE);
        const ok = (await Promise.all([PAGE, PDF].map((p) => cache.match(p)))).every(Boolean);
        if (event.source) event.source.postMessage({ type: "zap-cached", ok });
      }),
  );
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/** Is this response the real pamphlet page (or the real PDF), fit to replace the saved copy? */
async function isGood(path, response) {
  if (!response.ok || response.redirected) return false;
  const type = response.headers.get("content-type") || "";
  if (path === PDF) return type.includes("application/pdf");
  return type.includes("text/html") && (await response.clone().text()).includes(PAGE_MARKER);
}

function networkFirst(event, path) {
  const network = fetch(event.request);
  event.respondWith(
    withTimeout(network, PAGE_TIMEOUT_MS)
      .then(async (response) => {
        if (response.status >= 500) throw new Error("server error");
        if (await isGood(path, response)) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE).then((cache) => cache.put(path, copy)));
          return response;
        }
        // Not the real page (a Wi-Fi login page, a proxy error): prefer the saved copy if there is one.
        return (await caches.match(path)) || response;
      })
      .catch(() => caches.match(path).then((saved) => saved || network)),
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname === PAGE || url.pathname === PDF) {
    if (url.search === "") networkFirst(event, url.pathname);
    return;
  }
  if (request.mode === "navigate" || !keepable(url)) return;

  event.respondWith(
    caches.match(request).then((saved) => {
      const network = fetch(request).then((response) => {
        if (saved && response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
        }
        return response;
      });
      if (saved) {
        network.catch(() => undefined);
        return saved;
      }
      return network;
    }),
  );
});
