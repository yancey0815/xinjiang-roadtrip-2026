const CACHE="banlv-offline-v1";
const BASE="/xinjiang-roadtrip-2026";
const CORE=[`${BASE}/`,`${BASE}/?shared=1`,`${BASE}/manifest.webmanifest`,`${BASE}/favicon.svg`,`${BASE}/travel-pose-guide-v1.png`,`${BASE}/wechat-share-card.png`];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||((event.request.mode==="navigate")?caches.match(`${BASE}/`):Response.error()))));
});
