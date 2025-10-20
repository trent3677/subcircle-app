// Service Worker for Push Notifications
console.log('Service Worker: Loading...');

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received', event);
  
  if (!event.data) {
    console.log('Service Worker: No data in push event');
    return;
  }

  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.log('Service Worker: Failed to parse push data as JSON, using text');
    data = {
      title: 'SubCircle Notification',
      message: event.data.text() || 'You have a new notification',
    };
  }

  console.log('Service Worker: Push data processed', data);

  const title = data.title || 'SubCircle Notification';
  const options = {
    body: data.message || 'You have a new notification',
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    image: data.image,
    vibrate: data.vibrate || [200, 100, 200],
    data: {
      url: data.url || data.action_url || '/notifications',
      notificationId: data.id || `notification-${Date.now()}`,
      timestamp: Date.now(),
      ...data
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: data.priority === 'urgent',
    silent: data.priority === 'low',
    tag: data.tag || 'subcircle-notification',
    renotify: true,
    timestamp: Date.now()
  };

  console.log('Service Worker: Showing notification', title, options);

  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('Service Worker: Notification shown successfully');
      })
      .catch((error) => {
        console.error('Service Worker: Failed to show notification', error);
      })
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    console.log('Service Worker: Notification dismissed');
    return;
  }

  const urlToOpen = event.notification.data?.url || '/notifications';
  console.log('Service Worker: Opening URL', urlToOpen);
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      console.log('Service Worker: Found clients', clients.length);
      
      // Check if there's already a window/tab open with the target URL
      for (const client of clients) {
        if (client.url.includes(new URL(urlToOpen, self.location.origin).pathname) && 'focus' in client) {
          console.log('Service Worker: Focusing existing client');
          return client.focus();
        }
      }
      
      // If not, open a new window/tab with the URL
      if (self.clients.openWindow) {
        const fullUrl = new URL(urlToOpen, self.location.origin).href;
        console.log('Service Worker: Opening new window', fullUrl);
        return self.clients.openWindow(fullUrl);
      }
    }).catch((error) => {
      console.error('Service Worker: Error handling notification click', error);
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed', event.notification.data);
});

// Handle background sync (for offline notification queuing)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'notification-sync') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {
    console.log('Service Worker: Syncing notifications...');
    // This would sync any queued notifications when back online
    // For now, we'll just log that sync happened
    console.log('Service Worker: Notifications synced successfully');
  } catch (error) {
    console.error('Service Worker: Failed to sync notifications:', error);
  }
}

// Handle message from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Received message', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker: Error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker: Unhandled Promise Rejection', event.reason);
});

console.log('Service Worker: Setup complete');