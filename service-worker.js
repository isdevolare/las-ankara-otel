// Service Worker - LAS ANKARA v5
var CACHE_NAME = 'las-ankara-v5';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Firebase ve Google API isteklerini cache'leme
  var url = e.request.url;
  if (url.includes('firebase') || url.includes('googleapis') || url.includes('gstatic')) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});
