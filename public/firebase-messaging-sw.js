importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDICMeTIPUf-ZImdzY7-kY9lwcIZwfQJD4",
  projectId: "hoshiyartech-c61ee",
  messagingSenderId: "182981435781",
  appId: "1:182981435781:web:130fb1005ba2425d79a4ec",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "HoshiyarTech — Naya Article! 🎉";
  const body = (payload.notification && payload.notification.body) || "Naya article padho — Technology ko andar se samjho!";
  const url = (payload.data && payload.data.url) || "/";
  self.registration.showNotification(title, {
    body,
    icon: "/logo.jpg",
    data: { url },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(clients.openWindow(url));
});
