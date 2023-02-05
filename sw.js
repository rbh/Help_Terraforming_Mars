// Files to cache
var cacheName = 'Help_Terraforming_Mars-8';
var appShellFiles = [ './',
		      'index.html',
		      'app.js',
		      'style.css',
		      'icons/Mars-16.png',
		      'icons/Mars-32.png',
		      'icons/Mars-57.png',
		      'icons/Mars-60.png',
		      'icons/Mars-72.png',
		      'icons/Mars-76.png',
		      'icons/Mars-96.png',
		      'icons/Mars-114.png',
		      'icons/Mars-120.png',
		      'icons/Mars-144.png',
		      'icons/Mars-152.png',
		      'icons/Mars-180.png',
		      'icons/Mars-192.png',
		      'icons/Mars-512.png'
		    ];

// Installing Service Worker
self.addEventListener('install', function(e) {
    e.waitUntil(
	caches.open(cacheName).then(function(cache) {
	    return cache.addAll(appShellFiles);
	})
    );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
    e.respondWith(
	caches.match(e.request).then(function(r) {
	    // console.log('[Service Worker] Fetching resource: '+e.request.url);
	    return r || fetch(e.request).then(function(response) {
		return caches.open(cacheName).then(function(cache) {
		    // console.log('[Service Worker] Caching new resource: '+e.request.url);
		    cache.put(e.request, response.clone());
		    return response;
		});
	    });
	})
    );
});

// Ensure old versions are removed.
self.addEventListener('activate', function(e) {
    e.waitUntil(
	caches.keys()
	    .then(function(keyList) {
		return Promise.all(
		    keyList.map(function(key) {
			if (cacheName !== key) {
			    return caches.delete(key);
			}
		    }));
	    })
    );
});
