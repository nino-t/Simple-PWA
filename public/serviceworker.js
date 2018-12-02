/* eslint-disable */
var CACHE_NAME = "lpwa-cache-v1";
var CACHED_URLS = [
  "/index.html",
  "/css/youchat.min.css",
  "/js/jquery.min.js",
  "/js/app.js",
  "/users.json",
  "/messages.json",
  "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener("fetch", function(event) {
  var requestURL = new URL(event.request.url);
  if (requestURL.pathname === "/" || requestURL.pathname === "/index.html") {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match("/index.html").then(function(cachedResponse) {
          var fetchPromise = fetch("/index.html").then(function(networkResponse) {
            cache.put("/index.html", networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
  } else if (requestURL.pathname === "/users.json") {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  } else if (requestURL.pathname === "/messages.json") {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(function() {
          console.log("You are currently offline. The content of this page may be out of date.");
          return caches.match(event.request);
        });
      })
    );
  } else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname)
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        });
      })
    );
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME !== cacheName && cacheName.startsWith("lpwa-cache")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});