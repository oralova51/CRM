// client/public/sw.js

const CACHE_NAME = 'ideal-body-v1';

// Устанавливаем Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  self.skipWaiting(); // Активируем сразу
});

// Активируем Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(clients.claim()); // Начинаем управлять всеми клиентами
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  console.log('📨 Push received:', event);

  let data = {};
  
  try {
    // Пытаемся распарсить данные
    if (event.data) {
      data = event.data.json();
      console.log('📦 Push data:', data);
    }
  } catch (error) {
    console.error('❌ Error parsing push data:', error);
    data = {
      title: 'Ideal Body Studio',
      body: 'Напоминание о процедуре'
    };
  }

  const options = {
    body: data.body || 'У вас запланирована процедура',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      bookingId: data.bookingId,
      timestamp: data.timestamp || Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Открыть'
      },
      {
        action: 'close',
        title: 'Закрыть'
      }
    ],
    tag: 'booking-reminder',
    renotify: true,
    requireInteraction: true // Уведомление не закрывается автоматически
  };

  const title = data.title || 'Ideal Body Studio';

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.data);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    })
    .then((windowClients) => {
      // Проверяем, есть ли уже открытая вкладка с этим URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          console.log('🔄 Focusing existing tab');
          return client.focus();
        }
      }
      
      // Если нет — открываем новую
      console.log('📂 Opening new tab');
      return clients.openWindow(urlToOpen);
    })
  );
});

// Обработка закрытия уведомления
self.addEventListener('notificationclose', (event) => {
  console.log('🚫 Notification closed:', event.notification.data);
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  console.log('💬 Message from client:', event.data);
  
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});