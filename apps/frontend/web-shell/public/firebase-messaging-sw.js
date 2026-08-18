/* ───────────────────────────────────────────
   Service worker de Firebase Cloud Messaging — muestra la notificación
   cuando llega un push con la pestaña en segundo plano o cerrada.

   La config de Firebase no puede venir de variables de entorno acá (esto no
   pasa por el build de Next.js): se recibe por query string al registrar el
   service worker en lib/firebase.ts.
   ─────────────────────────────────────────── */

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
};

if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title ?? 'Rumbo';
    const body = payload.notification?.body ?? '';
    self.registration.showNotification(title, {
      body,
      icon: '/next.svg',
    });
  });
}
