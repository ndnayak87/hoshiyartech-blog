import { useState, useEffect } from "react";
import { subscribePush } from "../lib/notify";

const ASK_KEY = "ht_push_asked";

// Pehli visit par Hindi popup: Haan / Abhi nahi
export default function NotifyPrompt() {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let asked = false;
    try { asked = localStorage.getItem(ASK_KEY) === "1"; } catch {}
    if (asked) return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "denied") return;
    const t = setTimeout(() => setShow(true), 8000); // 8 sec baad, araam se
    return () => clearTimeout(t);
  }, []);

  function close() {
    try { localStorage.setItem(ASK_KEY, "1"); } catch {}
    setShow(false);
  }

  async function allow() {
    setBusy(true);
    const r = await subscribePush();
    close();
    setBusy(false);
    if (r.ok) {
      window.dispatchEvent(new Event("push-sub"));
      alert("🔔 Dhanyavaad! Ab naya article aate hi khabar milegi!");
    } else {
      alert("⚠️ " + r.error);
    }
  }

  if (!show) return null;

  return (
    <div className="push-pop">
      <div className="push-box">
        <div className="push-emoji">🔔</div>
        <b>Naye articles ki jaankari chahiye?</b>
        <p>Naya article aate hi aapke phone par khabar milegi. Bilkul free hai!</p>
        <div className="push-btns">
          <button className="btn btn-primary btn-small" onClick={allow} disabled={busy}>
            {busy ? "⏳..." : "✅ Haan, chahiye!"}
          </button>
          <button className="btn btn-ghost btn-small" onClick={close}>Abhi nahi</button>
        </div>
      </div>
    </div>
  );
}
