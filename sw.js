// China · funcionamento offline
const CACHE='china-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request,u=new URL(req.url);
  if(req.method!=='GET'||u.origin!==self.location.origin)return; // Groq e demais serviços vão direto para a rede
  e.respondWith(fetch(req).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})
    .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
