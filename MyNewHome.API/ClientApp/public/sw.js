importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js"
);

workbox.core.setCacheNameDetails({
  prefix: "mynewhome",
  suffix: "v2",
  precache: "precache",
  runtime: "runtime"
});

// Don't forget to increase the revision number of index.html (aka. '/')
// as it is needed to include the newly genereted js and css files.
// Error would be thrown: Refused to execute script from '...' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.
const build = "2.0.42";
console.log(`Build: ${build}`);
workbox.precaching.precacheAndRoute([
  { url: "/", revision: build.replace(/\./g, "") },
  { url: "manifest.json", revision: "2" }
]);

const bgSyncPlugin = new workbox.backgroundSync.Plugin("bgSyncQueue");

// [NETWORK FIRST] Cache list from 'GET /api/pets'
workbox.routing.registerRoute(
  ({ url }) => url.pathname === "/api/pets",
  workbox.strategies.networkFirst({
    cacheName: "api-cache",
    plugins: [bgSyncPlugin]
  })
);

// [CACHE FIRST] Cache Application Insights script
workbox.routing.registerRoute(
  /https:\/\/(.*).msecnd.net\/(.*)/,
  workbox.strategies.cacheFirst({
    cacheName: "static-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60 // 1 Day
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
);

// [STALE WHILE REVALIDATE] Cache CSS and JS files
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "static-cache"
  })
);

// [CACHE FIRST] Cache image files
workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  workbox.strategies.cacheFirst({
    cacheName: "image-cache",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

workbox.skipWaiting();
workbox.clientsClaim();
