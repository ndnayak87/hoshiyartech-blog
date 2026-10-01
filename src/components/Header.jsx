import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { subscribePush, isSubscribed } from "../lib/notify";

export default function Header({ search, setSearch }) {
  const { isAdmin, user, logout } = useAuth();
  const nav = useNavigate();
  const [bell, setBell] = useState(isSubscribed() ? "on" : "off");

  useEffect(() => {
    const on = () => setBell("on");
    window.addEventListener("push-sub", on);
    return () => window.removeEventListener("push-sub", on);
  }, []);

  async function ring() {
    if (bell === "on") { alert("🔔 Notification pehle se ON hai! Naya article aate hi khabar milegi!"); return; }
    setBell("...");
    const r = await subscribePush();
    if (r.ok) { setBell("on"); alert("🔔 Done! Ab naya article aate hi notification milegi!"); }
    else { setBell("off"); alert("⚠️ " + r.error); }
  }

  return (
    <header className="header">
      <div className="nav">
        <Link to="/" className="brand" onClick={() => { setSearch(""); window.scrollTo(0, 0); }}>
          <img src="/logo.jpg" alt="Hoshiyar Tech"
            onError={(e) => { e.target.style.display = "none"; }} />
          <h1>Hoshiyar <span>Tech</span><small>Technology को अंदर से समझें</small></h1>
        </Link>
        <div className="nav-actions">
          <button className="btn btn-ghost btn-small" onClick={ring} title="Naye article ki khabar!">
            {bell === "on" ? "🔔 ON" : bell === "..." ? "⏳..." : "🔔 Notify Me"}
          </button>
          <input className="search" placeholder="🔍 Search karo..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {isAdmin ? (
            <>
              <span className="who">👑 {user}</span>
              <button className="btn btn-primary btn-small" onClick={() => nav("/write")}>✍️ Likho</button>
              <button className="btn btn-ghost btn-small" onClick={() => nav("/admin")}>Admin</button>
              <button className="btn btn-ghost btn-small" onClick={() => { logout(); nav("/"); }}>Logout</button>
            </>
          ) : (
            <button className="btn btn-primary btn-small" onClick={() => nav("/login")}>🔐 Admin Login</button>
          )}
        </div>
      </div>
    </header>
  );
}
