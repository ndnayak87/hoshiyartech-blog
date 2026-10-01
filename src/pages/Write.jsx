import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES } from "../lib/seed";
import { renderMarkdown } from "../lib/markdown";

export default function Write({ blogs, onCreate, onUpdate }) {
  const { id } = useParams();
  const nav = useNavigate();
  const editing = id ? blogs.find((b) => b.id === id) : null;

  const [form, setForm] = useState(() =>
    editing
      ? { ...editing, tags: (editing.tags || []).join(", ") }
      : { title: "", category: CATEGORIES[0], tags: "", excerpt: "", content: "", author: "Hoshiyar Tech", image: "" }
  );
  const [tab, setTab] = useState("write"); // write | preview
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function save(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { alert("Title aur Content zaroori hai!"); return; }
    const data = {
      title: form.title.trim(),
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      excerpt: form.excerpt.trim() || form.content.replace(/[#*`>-]/g, "").slice(0, 140) + "...",
      content: form.content,
      author: form.author || "Hoshiyar Tech",
      image: (form.image || "").trim(),
    };
    if (editing) { onUpdate(editing.id, data); nav(`/post/${editing.id}`); }
    else { const b = onCreate(data); nav(`/post/${b.id}`); }
  }

  function insert(snippet) {
    setForm({ ...form, content: (form.content || "") + snippet });
  }

  return (
    <div className="container wide">
      <br />
      <h2>{editing ? "✏️ Article Edit Karo" : "✍️ Naya Article Likho"}</h2>
      <p className="muted">Markdown supported — heading, code, bold, list sab chalega. Preview tab me live dekho.</p>
      <div className="toolbar">
        <button type="button" className="btn btn-ghost btn-small" onClick={() => insert("\n## Heading\n")}>H2</button>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => insert("**bold**")}>Bold</button>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => insert("`code`")}>Code</button>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => insert("\n```js\nconsole.log('hello')\n```\n")}>{"{ }"} Block</button>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => insert("\n- point 1\n- point 2\n")}>List</button>
        <span style={{ flex: 1 }} />
        <button type="button" className={"chip" + (tab === "write" ? " active" : "")} onClick={() => setTab("write")}>Write</button>
        <button type="button" className={"chip" + (tab === "preview" ? " active" : "")} onClick={() => setTab("preview")}>Preview</button>
      </div>
      <form className="form" onSubmit={save}>
        <input value={form.title} onChange={set("title")} placeholder="Ex: React me API kaise call kare?" />
        <div className="row2">
          <select value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={form.author} onChange={set("author")} placeholder="Author" />
        </div>
        <input value={form.tags} onChange={set("tags")} placeholder="Tags: react, api, hindi (comma se alag)" />
        <input value={form.excerpt} onChange={set("excerpt")} placeholder="2 line summary (khali chhoda to auto-banega)" />
        <input value={form.image || ""} onChange={set("image")} placeholder="Cover photo ka link (optional) — khali ho to category emoji lagega" />
        {tab === "write" ? (
          <textarea className="big" value={form.content} onChange={set("content")}
            placeholder={"# Apna article yaha likho...\n\n## Example code:\n```js\nconst x = 10;\n```\n"} />
        ) : (
          <div className="md preview-box" dangerouslySetInnerHTML={{ __html: renderMarkdown(form.content || "*Kuch likho — preview yaha dikhega...*") }} />
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => nav(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary">🚀 {editing ? "Update" : "Publish"}</button>
        </div>
      </form>
    </div>
  );
}
