import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Admin({ blogs, onDelete, onReset }) {
  const { user, logout, changePassword } = useAuth();
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");

  function doChange(e) {
    e.preventDefault();
    const r = changePassword(oldPw, newPw);
    setMsg(r.ok ? "✅ Password badal gaya!" : "❌ " + r.error);
    if (r.ok) { setOldPw(""); setNewPw(""); }
  }

  return (
    <div className="container wide">
      <br />
      <h2>👑 Admin Dashboard</h2>
      <p className="muted">Welcome, <b>{user}</b>! Yaha se articles manage karo.</p>
      <div className="admin-grid">
        <div className="panel">
          <h3>📝 Articles ({blogs.length})</h3>
          <Link className="btn btn-primary btn-small" to="/write">+ Naya Article</Link>
          {" "}
          <button className="btn btn-ghost btn-small" onClick={() => { if (confirm("Sample articles wapas laaye? Naye articles hat jayenge.")) onReset(); }}>Reset demo</button>
          {" "}
          <button className="btn btn-ghost btn-small" onClick={logout}>Logout</button>
          <div className="table">
            {blogs.map((b) => (
              <div key={b.id} className="trow">
                <span className="tcover">{b.image ? <img src={b.image} alt="" loading="lazy" /> : b.cover}</span>
                <span className="ttitle">{b.title}<small>{b.category} • {b.date}</small></span>
                <Link className="btn btn-ghost btn-small" to={`/edit/${b.id}`}>Edit</Link>
                <button className="btn btn-danger btn-small" onClick={() => { if (confirm("Delete?")) onDelete(b.id); }}>Del</button>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>🔑 Password Badlo</h3>
          <form className="form" onSubmit={doChange}>
            <label>Purana password<input type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} /></label>
            <label>Naya password (min 6 char)<input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></label>
            {msg && <div className="hint">{msg}</div>}
            <button className="btn btn-primary btn-small" type="submit">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
}
