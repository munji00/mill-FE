self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const payload = event.data.json();
      const options = {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: payload.badge || '/favicon.ico',
        data: payload.data || { url: '/notifications' }
      };
      
      event.waitUntil(
        self.registration.showNotification(payload.title || 'Rice Mill Alert', options)
      );
    } catch (err) {
      console.error('Error rendering push notification payload:', err);
      // Fallback if payload isn't JSON
      const options = {
        body: event.data.text(),
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: { url: '/notifications' }
      };
      event.waitUntil(
        self.registration.showNotification('Rice Mill Alert', options)
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // Check if there is already a window open with this app
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
