import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "./firebase";

const VAPID_KEY = "BKSYjqfHJOJqa1wjl-dYjDLMs04jvXifK5cDJ0fYeSJYL-MUWh-fuCWZ86_vOtG_IS9O9udGgk1tqyEntozpbdg";
const SUB_KEY = "ht_push_subscribed";

// Bell dabane par: permission + token + Firestore me save
export async function subscribePush() {
  if (!app || !db) return { ok: false, error: "Firebase ready nahi hai!" };
  if (!("Notification" in window)) return { ok: false, error: "Ye browser notification support nahi karta!" };
  try {
    const supported = await isSupported().catch(() => false);
    if (!supported) return { ok: false, error: "Is browser me push nahi chalega!" };

    const perm = await Notification.requestPermission();
    if (perm !== "granted") return { ok: false, error: "Notification Allow nahi kiya! Bell dabakar Allow karo." };

    const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: reg });
    if (!token) return { ok: false, error: "Token nahi bana, dobara try karo!" };

    await setDoc(doc(db, "push_tokens", btoa(token).replace(/[/+=]/g, "").slice(0, 60)), {
      token,
      date: new Date().toISOString(),
    });
    try { localStorage.setItem(SUB_KEY, "1"); } catch {}
    return { ok: true };
  } catch (e) {
    console.warn("push subscribe fail:", e);
    return { ok: false, error: "Kuch atak gaya: " + (e.message || e) };
  }
}

export function isSubscribed() {
  try { return localStorage.getItem(SUB_KEY) === "1"; } catch { return false; }
}

// Site khuli ho tab aane wale msg turant dikhao
export function listenForeground() {
  if (!app) return;
  isSupported().then((ok) => {
    if (!ok) return;
    try {
      const messaging = getMessaging(app);
      onMessage(messaging, (payload) => {
        const title = (payload.notification && payload.notification.title) || "HoshiyarTech — Naya Article! 🎉";
        const body = (payload.notification && payload.notification.body) || "Naya article padho!";
        if (Notification.permission === "granted") {
          new Notification(title, { body, icon: "/logo.jpg" });
        }
      });
    } catch {}
  }).catch(() => {});
}
