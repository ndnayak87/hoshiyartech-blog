import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../lib/seed";

export default function Home({ blogs, search, onReset }) {
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return blogs
      .filter((b) => {
        const okCat = cat === "All" || b.category === cat;
        const hay = (b.title + " " + b.excerpt + " " + b.content + " " + (b.tags || []).join(" ")).toLowerCase();
        return okCat && (!q || hay.includes(q));
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [blogs, search, cat]);

  return (
    <div className="container">
      <section className="hero">
        <div className="badge">📚 Har Hafte Nayi Jaankari • Aasaan Hindi me</div>
        <h2>Hoshiyar<span className="grad">Tech</span></h2>
        <p>Technology को अंदर से समझें</p>
        <div className="stats">
          <div className="stat"><b>{blogs.length}</b>Total Articles</div>
          <div className="stat"><b>{CATEGORIES.length}</b>Categories</div>
        </div>
      </section>

      <div className="filters">
        {["All", ...CATEGORIES].map((c) => (
          <button key={c} className={"chip" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>{c}</button>
        ))}
        <span className="hint right">{filtered.length} articles • <button className="linklike" onClick={onReset}>reset demo</button></span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty"><h3>😕 Kuch nahi mila</h3><p>Search badlo ya Admin se login karke naya article likho.</p></div>
      ) : (
        <div className="grid">
          {filtered.map((b) => (
            <Link key={b.id} to={`/post/${b.slug || b.id}`} className="card">
              <div className="card-cover">{b.image ? <img src={b.image} alt={b.title} loading="lazy" /> : (b.cover || "📝")}</div>
              <div className="card-body">
                <div className="card-cat">{b.category} • {b.readTime} min read</div>
                <h3>{b.title}</h3>
                <p>{b.excerpt}</p>
                <div className="tags">{(b.tags || []).slice(0, 3).map((t) => <span key={t} className="tag">#{t}</span>)}</div>
                <div className="meta">
                  <div className="dot">{(b.author || "H")[0]}</div>
                  <span>{b.author} • {b.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="footer">Made by <b>HoshiyarTech</b> • <a className="wa-link" target="_blank" rel="noreferrer" href="https://wa.me/918871626560?text=Namaste!%20Mujhe%20HoshiyarTech%20ke%20baare%20me%20baat%20karni%20hai%20%F0%9F%99%8F">💬</a></div>
    </div>
  );
}
