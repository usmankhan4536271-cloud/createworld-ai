const CACHE="createworld-ai-v2";
const ASSETS=["./","./index.html","./style.css","./app.js","./manifest.json","./img/logo.png","./img/favicon.png","./img/icon-192.png","./img/showcase.jpg","./img/poster.jpg"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))));
self.addEventListener("fetch",e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
