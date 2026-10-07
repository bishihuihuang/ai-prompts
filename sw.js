/* AI 提示词库 PWA Service Worker（修缮版 2026-10-04）
 * 策略：
 *  - 页面/HTML/JSON：网络优先，离线回退缓存 → 发布新版后用户正常刷新即可拿到最新内容
 *  - 其余静态资源（图片等）：缓存优先 + 后台静默更新 → 秒开
 *  - 缓存名含构建时间戳：构建时由 构建工具/混淆.js 自动替换 __BUILD__，每次发版全量换新缓存
 */
const CACHE = 'ai-prompts-202610071451';
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './AI提示词系统/AI提示词管理.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const p = url.pathname;
  const isDoc = e.request.mode === 'navigate' || p.endsWith('.html') || p.endsWith('/') || p.endsWith('.json');
  if (isDoc) {
    // 网络优先
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) {
          const cp = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
    );
  } else {
    // 缓存优先 + 后台更新
    e.respondWith(
      caches.match(e.request).then(hit => {
        const net = fetch(e.request).then(res => {
          if (res && res.ok) {
            const cp = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, cp));
          }
          return res;
        });
        if (hit) { net.catch(() => {}); return hit; }
        return net;
      })
    );
  }
});
