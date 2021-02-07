var serviceWorkerVersion = 1; //increment to force update - do this on every commit
var CACHE_NAME = 'cache-v1';
var urlsToCache = [
	"/",
	"/manifest.json",
	"/fonts/roboto-light.ttf",

	"/css/body.css",
	"/css/app.css",
	"/css/header.css",
	"/css/sideNav.css",
	"/css/statsDisplay.css",
	"/css/graphDisplay.css",
	"/css/transactionsDisplay.css",
	"/css/settingsDisplay.css",
	"/css/legalDisplay.css",
	"/css/addTransaction.css",
	"/css/sync.css",
	"/css/filter.css",
	"/css/toggleSwitch.css",

	"/js/UIChanges.js",
	"/js/statsDisplay.js",
	"/js/graphDisplay.js",
	"/js/transactionsDisplay.js",
	"/js/addTransaction.js",
	"/js/editTransaction.js",
	"/js/settings.js",
	"/js/sync.js",
	"/js/filter.js",
	"/js/semunciaMain.js",
	"/js/graphDisplayWorker.js",

	"/images/logo_16x16.png",
	"/images/logo_32x32.png",
	"/images/logo_48x48.png",
	"/images/logo_96x96.png",
	"/images/logo_152x152.png",
	"/images/logo_192x192.png",
	"/images/logo_196x196.png",
	"/images/logo_228x228.png"
];

self.addEventListener('install', function(event) {
	event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
		console.log('Opened cache');
		return cache.addAll(urlsToCache);
	})
  );
});

self.addEventListener('fetch', function(event) {
	event.respondWith(caches.match(event.request).then(function(response) {
			if (response) {
				return response;
			} else{
				return fetch(event.request);	
			}
		}
	));
});