import { Link } from "react-router-dom";

const SERVICES = [
  { emoji: "🌐", title: "Website Development", desc: "Modern, fast aur mobile-friendly websites!" },
  { emoji: "📱", title: "Mobile App", desc: "Android apps — Play Store listing ke saath!" },
  { emoji: "🎓", title: "Domain & Hosting", desc: "Naam, hosting, email setup — poora intezaam!" },
  { emoji: "🔍", title: "SEO & Growth", desc: "Google ranking, notifications, analytics!" },
];

export default function Company() {
  return (
    <div>
      <section className="co-hero">
        <img src="/logo.jpg" alt="HoshiyarTech" className="co-logo-lg" />
        <h1>HoshiyarTech</h1>
        <p className="co-tag">Technology को अंदर से समझें — aur banayein!</p>
        <p className="hint">Raipur, Chhattisgarh • Udyam Registered (MSME)</p>
      </section>

      <div className="container narrow">
        <h2 className="co-sect">👋 Know Us</h2>
        <div className="co-card">
          <p>HoshiyarTech ki shuruaat Hindi me technology samjhane se hui — aaj hum modern websites, mobile apps aur digital solutions banate hain!</p>
        </div>

        <h2 className="co-sect">💼 Services</h2>
        {SERVICES.map((s) => (
          <div key={s.title} className="co-card">
            <b>{s.emoji} {s.title}</b>
            <p>{s.desc}</p>
          </div>
        ))}

        <h2 className="co-sect">📊 Numbers</h2>
        <div className="co-stats">
          <div><b>7+</b><span>Live Sites</span></div>
          <div><b>30</b><span>Hindi Articles</span></div>
          <div><b>8</b><span>Categories</span></div>
        </div>

        <h2 className="co-sect">📞 Connect</h2>
        <div className="co-card">
          <p>📱 Phone/WhatsApp: <a className="linklike" target="_blank" rel="noreferrer" href="https://wa.me/918871626560">88716 26560</a></p>
          <p>📧 Email: <span className="linklike">ndnayak87@gmail.com</span></p>
          <p>📍 Silyari, Raipur, Chhattisgarh</p>
        </div>

        <p className="hint" style={{ textAlign: "center" }}>
          <Link to="/" className="linklike">← Wapas articles par</Link>
        </p>
        <br />
      </div>
    </div>
  );
}
