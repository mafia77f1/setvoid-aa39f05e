// Service Worker للإشعارات
const CACHE_NAME = 'setvoid-v1';

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] تم تثبيت Service Worker');
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] تم تفعيل Service Worker');
  event.waitUntil(clients.claim());
});

// استقبال رسائل من التطبيق
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, tag, data } = event.data.payload;
    
    self.registration.showNotification(title, {
      body,
      icon: icon || '/favicon.png',
      badge: '/favicon.png',
      tag: tag || 'default',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      data,
      actions: [
        { action: 'open', title: 'فتح' },
        { action: 'close', title: 'إغلاق' }
      ]
    });
  }
});

// النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((windowClients) => {
          // البحث عن نافذة مفتوحة
          for (const client of windowClients) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.focus();
              client.navigate(urlToOpen);
              return;
            }
          }
          // فتح نافذة جديدة
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// إشعارات Push من الخادم (للمستقبل)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/favicon.png',
        badge: '/favicon.png',
        vibrate: [200, 100, 200],
        data: data.data
      })
    );
  }
});
