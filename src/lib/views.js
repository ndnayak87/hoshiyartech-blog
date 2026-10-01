import { doc, getDoc, getDocs, collection, runTransaction } from "firebase/firestore";
import { db } from "./firebase";

// Blog khulne par view +1 (transaction = safe counting)
export async function bumpView(blogId) {
  if (!db) return null;
  try {
    const ref = doc(db, "views", blogId);
    const count = await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const next = (snap.exists() ? (snap.data().count || 0) : 0) + 1;
      tx.set(ref, { count: next }, { merge: true });
      return next;
    });
    return count;
  } catch (e) {
    console.warn("view count fail:", e);
    return null;
  }
}

// Home page ke liye saare counters ek saath
export async function getAllViews() {
  if (!db) return {};
  try {
    const snap = await getDocs(collection(db, "views"));
    const map = {};
    snap.forEach((d) => { map[d.id] = d.data().count || 0; });
    return map;
  } catch (e) {
    console.warn("views load fail:", e);
    return {};
  }
}

export async function getView(blogId) {
  if (!db) return 0;
  try {
    const snap = await getDoc(doc(db, "views", blogId));
    return snap.exists() ? (snap.data().count || 0) : 0;
  } catch {
    return 0;
  }
}
