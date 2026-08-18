/* ───────────────────────────────────────────
   Firebase — notificaciones push (FCM)
   Sin las variables NEXT_PUBLIC_FIREBASE_* configuradas, todo esto queda
   deshabilitado en silencio: la app funciona igual, solo no hay push.
   ─────────────────────────────────────────── */

import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getMessaging, getToken, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && vapidKey);

function getFirebaseApp() {
  if (!firebaseConfigured) return null;
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === 'undefined' || !firebaseConfigured) return null;
  if (!(await isSupported().catch(() => false))) return null;
  const app = getFirebaseApp();
  return app ? getMessaging(app) : null;
}

/** Pide permiso de notificaciones (si hace falta) y devuelve el token FCM del
    dispositivo, o `null` si el usuario lo negó / el navegador no soporta push
    / Firebase no está configurado. No lanza — cualquier falla es "no hay push". */
export async function requestPushToken(): Promise<string | null> {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;

    let permission = Notification.permission;
    if (permission === 'default') permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    /* La config va por query string: el service worker es un archivo estático
       en /public, no pasa por el build de Next.js ni ve process.env. */
    const swParams = new URLSearchParams(
      Object.entries(firebaseConfig).filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swParams}`);
    return await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  } catch {
    return null;
  }
}
