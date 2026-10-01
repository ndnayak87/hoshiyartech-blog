import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { renderMarkdown } from "../lib/markdown";
import { useAuth } from "../lib/auth";

export default function Post({ blogs, onDelete }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { isAdmin } = useAuth();
  const blog = blogs.find((b) => b.id === id || b.slug === id);

  useEffect(() => {
    document.title = blog ? `${blog.title} — HoshiyarTech` : "HoshiyarTech";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && blog) meta.setAttribute("content", blog.excerpt || blog.title);
    return () => { document.title = "Hoshiyar Tech — Technology को अंदर से समझें"; };
  }, [blog]);

  if (!blog) {
    return (
      <div className="container narrow center-box">
        <h2>Article nahi mila 😕</h2>
        <Link className="btn btn-ghost" to="/">← Home wapas</Link>
      </div>
    );
  }

  return (
    <div className="container narrow">
      <br />
      <Link className="back" to="/">← Sab articles</Link>
      <div className="post-head">
        <div className="card-cat">{blog.category} • {blog.readTime} min • {blog.date}</div>
        <h1>{blog.title}</h1>
        <div className="meta"><div className="dot">{(blog.author || "H")[0]}</div><span>{blog.author}</span></div>
        {blog.image ? (
          <figure className="post-fig">
            <img className="post-img" src={blog.image} alt={blog.title} />
            {blog.imageCredit && <figcaption>{blog.imageCredit}</figcaption>}
          </figure>
        ) : (
          <div className="post-cover">{blog.cover || "📝"}</div>
        )}
      </div>
      <article className="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }} />
      <div className="tags"> {(blog.tags || []).map((t) => <span key={t} className="tag">#{t}</span>)}</div>
      {isAdmin && (
        <div className="post-admin">
          <button className="btn btn-ghost btn-small" onClick={() => nav(`/edit/${blog.id}`)}>✏️ Edit</button>
          <button className="btn btn-danger btn-small" onClick={() => {
            if (confirm("Pakka delete karna hai?")) { onDelete(blog.id); nav("/"); }
          }}>🗑️ Delete</button>
        </div>
      )}
      <div className="footer">Made by <b>HoshiyarTech</b> • <a className="wa-link" target="_blank" rel="noreferrer" href="https://wa.me/918871626560?text=Namaste!%20Mujhe%20HoshiyarTech%20ke%20baare%20me%20baat%20karni%20hai%20%F0%9F%99%8F">💬</a></div>
    </div>
  );
}
