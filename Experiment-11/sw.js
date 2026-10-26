// sw.js - Service Worker & Express Cache-Control Middleware
const CACHE_NAME = "vansh-ds-lab-v1";
const STATIC_ASSETS = ["/Experiment-11/index.html", "/Experiment-11/styles.min.css", "/Experiment-11/app.min.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Express Static Caching & Compression Middleware (server-cache.js)
const express = require("express");
const path = require("path");
const app = express();

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "365d",
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      } else {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    }
  })
);