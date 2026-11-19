/*
 * FX Desk background script. Its only job is notifications.
 * iOS 18.4 and later shows our messages by itself (they carry the 8030
 * "declarative" marker); this script shows the same message on anything
 * older, and opens the right ticket when a notification is tapped.
 * It must ALWAYS show something for every push it receives: a browser that
 * sees silent pushes takes the permission away.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let n = { title: "FX Desk", body: "Open FX Desk for details." };
  try {
    const d = event.data ? event.data.json() : null;
    if (d && d.notification && d.notification.title) n = d.notification;
  } catch (e) {
    try { n.body = event.data.text() || n.body; } catch (e2) { /* keep the fallback text */ }
  }
  event.waitUntil(self.registration.showNotification(n.title, { body: n.body || "", tag: n.tag || undefined, data: { url: n.navigate || "/" } }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ("focus" in c) { if ("navigate" in c) c.navigate(url).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
