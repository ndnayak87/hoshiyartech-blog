import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported as analyticsSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// ⚠️ YE CONFIG ABHI ADHURI HAI — Firebase console se Web App ka config
// yahan paste karna hai (steps README me dekho). Tab tak site
// normaal chalegi, bas views-counter aur analytics band rahenge.
const firebaseConfig = {
  apiKey: "AIzaSyDICMeTIPUf-ZImdzY7-kY9lwcIZwfQJD4",
  authDomain: "hoshiyartech-c61ee.firebaseapp.com",
  projectId: "hoshiyartech-c61ee",
  storageBucket: "hoshiyartech-c61ee.firebasestorage.app",
  messagingSenderId: "182981435781",
  appId: "1:182981435781:web:130fb1005ba2425d79a4ec",
  measurementId: "G-NE8HCT48BV",
};

const isConfigured = !Object.values(firebaseConfig).some(
  (v) => typeof v === "string" && (v.startsWith("PASTE_") || v === "G-XXXXXXX")
);

let app = null;
let analytics = null;
let db = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    analyticsSupported().then((ok) => {
      if (ok) analytics = getAnalytics(app);
    }).catch(() => {});
  } catch (e) {
    console.warn("Firebase init fail:", e);
  }
}

export { app, analytics, db, logEvent, isConfigured };
