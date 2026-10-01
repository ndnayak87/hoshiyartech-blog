const { useState, useEffect, useMemo } = React;

const CATEGORIES = ["All", "React", "JavaScript", "Python", "AI / ML", "Web Dev", "Career"];
const COVERS = ["⚛️", "🚀", "🐍", "🤖", "💻", "🔥", "📱", "☁️"];

const DEFAULT_BLOGS = [
  {
    id: "b1",
    title: "React Hooks आसान भाषा में: useState और useEffect",
    category: "React",
    tags: ["react", "hooks", "beginner"],
    excerpt: "useState aur useEffect ko real examples ke saath samjho. Counter, API fetching aur cleanup — sab kuch Hindi me.",
    content: `React Hooks ne functional components ko superpower de di hai.\n\n1. useState — State ko hold karna\n\n\`const [count, setCount] = useState(0)\`\n\nButton click par setCount(count + 1) karo, UI auto-update ho jayega.\n\n2. useEffect — Side effects ke liye\n\n\`useEffect(() => {\n  fetch("/api/blogs").then(...)\n}, [])\`\n\nEmpty array [] ka matlab: sirf ek baar chalao (component mount par).\n\n3. Cleanup mat bhoolo\n\n\`useEffect(() => {\n  const id = setInterval(...)\n  return () => clearInterval(id)\n}, [])\`\n\nTIP: Har state ke liye alag useState use karo, ek bada object mat banao. Code clean rahega.`,
    author: "Hoshiyar Tech",
    date: "2026-09-20",
    readTime: 6,
    cover: "⚛️"
  },
  {
    id: "b2",
    title: "JavaScript Closures: Interview me sabse pucha jaane wala topic",
    category: "JavaScript",
    tags: ["javascript", "interview", "closure"],
    excerpt: "Closure kya hai? Function ke andar function aur lexical scope ko 5 minute me master karo.",
    content: `Closure = Function + uska lexical scope.\n\n\`function outer() {\n  let count = 0\n  return function inner() {\n    count++\n    return count\n  }\n}\nconst counter = outer()\ncounter() // 1\ncounter() // 2\`\n\ninner() function outer() ke ` + "`count`" + ` ko yaad rakhta hai, yehi closure hai.\n\nReal use-case:\n1. Data hiding / private variables\n2. Debounce / throttle\n3. Event handlers me state yaad rakhna\n\nInterview tip: "Counter without global variable" hamesha closure se banta hai.`,
    author: "Hoshiyar Tech",
    date: "2026-09-18",
    readTime: 5,
    cover: "🚀"
  },
  {
    id: "b3",
    title: "Python se AI journey start kaise kare? 2026 Roadmap",
    category: "AI / ML",
    tags: ["python", "ai", "roadmap"],
    excerpt: "Python basics se lekar LLMs tak — students ke liye step-by-step AI roadmap Hindi me.",
    content: `AI seekhne ka sahi order:\n\nSTEP 1: Python (2-3 hafte)\n- variables, loops, functions, OOP\n- pip, virtualenv\n\nSTEP 2: Math basics\n- numpy, pandas, matplotlib\n\nSTEP 3: Machine Learning\n- scikit-learn: regression, classification\n\nSTEP 4: Deep Learning\n- PyTorch ya TensorFlow\n\nSTEP 5: LLMs / GenAI\n- Prompting, LangChain, RAG, API use\n\nDaily 1 hour coding + 1 project har hafte. 90 din me portfolio ready!\n\nFree tools: Google Colab, Kaggle, HuggingFace.`,
    author: "Hoshiyar Tech",
    date: "2026-09-15",
    readTime: 8,
    cover: "🤖"
  },
  {
    id: "b4",
    title: "Blogging site ko fast kaise banaye? 7 Web Performance tips",
    category: "Web Dev",
    tags: ["performance", "web", "seo"],
    excerpt: "Image optimization, lazy loading, caching — apni site ko 3x fast karo.",
    content: `Fast site = zyada readers + better SEO.\n\n1. Images compress karo (WebP use karo)\n2. Lazy loading: \`loading="lazy"\`\n3. CSS/JS minify karo\n4. CDN use karo\n5. Unused code hatao\n6. Caching headers lagao\n7. Lighthouse me 90+ score ka target rakho\n\nYe Hoshiyar Tech blog bhi inhi principles par bana hai — pure React, no heavy backend!`,
    author: "Hoshiyar Tech",
    date: "2026-09-10",
    readTime: 4,
    cover: "💻"
  }
];

function loadBlogs() {
  try {
    const raw = localStorage.getItem("hoshiyar_tech_blogs");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_BLOGS;
}

function App() {
  const [blogs, setBlogs] = useState(loadBlogs);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [openId, setOpenId] = useState(null);
  const [editing, setEditing] = useState(null); // null | {} | blog
  const [form, setForm] = useState({ title:"", category:"React", tags:"", excerpt:"", content:"", author:"Hoshiyar Tech" });

  useEffect(() => {
    localStorage.setItem("hoshiyar_tech_blogs", JSON.stringify(blogs));
  }, [blogs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return blogs.filter(b => {
      const matchCat = cat === "All" || b.category === cat;
      const matchQ = !q || (b.title + " " + b.excerpt + " " + b.content + " " + (b.tags||[]).join(" ")).toLowerCase().includes(q);
      return matchCat && matchQ;
    }).sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [blogs, search, cat]);

  const openBlog = blogs.find(b => b.id === openId);

  function startNew() {
    setForm({ title:"", category:"React", tags:"", excerpt:"", content:"", author:"Hoshiyar Tech" });
    setEditing("new");
  }
  function startEdit(blog) {
    setForm({ ...blog, tags: (blog.tags||[]).join(", ") });
    setEditing(blog.id);
    setOpenId(null);
  }
  function saveBlog(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { alert("Title aur Content zaroori hai!"); return; }
    const tagsArr = form.tags.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean);
    if (editing === "new") {
      const nb = {
        id: "b" + Date.now(),
        title: form.title.trim(),
        category: form.category,
        tags: tagsArr,
        excerpt: form.excerpt.trim() || form.content.slice(0,120) + "...",
        content: form.content,
        author: form.author || "Hoshiyar Tech",
        date: new Date().toISOString().slice(0,10),
        readTime: Math.max(1, Math.ceil(form.content.split(/\s+/).length / 180)),
        cover: COVERS[Math.floor(Math.random()*COVERS.length)]
      };
      setBlogs([nb, ...blogs]);
    } else {
      setBlogs(blogs.map(b => b.id === editing ? {
        ...b, title: form.title.trim(), category: form.category, tags: tagsArr,
        excerpt: form.excerpt.trim() || form.content.slice(0,120)+"...",
        content: form.content, author: form.author,
        readTime: Math.max(1, Math.ceil(form.content.split(/\s+/).length/180))
      } : b));
    }
    setEditing(null);
  }
  function deleteBlog(id) {
    if (!confirm("Pakka delete karna hai?")) return;
    setBlogs(blogs.filter(b=>b.id!==id));
    setOpenId(null);
  }
  function resetDemo() {
    if (!confirm("Sample blogs wapas laaye? Aapke naye blogs hat jayenge.")) return;
    setBlogs(DEFAULT_BLOGS);
  }

  return (
    <div>
      <header className="header">
        <div className="nav">
          <div className="brand" onClick={()=>{setOpenId(null); setCat("All"); setSearch("");}}>
            <img src="HoshiyarTech_logo_.jpg" alt="Hoshiyar Tech" onError={(e)=>{e.target.style.display='none'}} />
            <h1>Hoshiyar <span>Tech</span><small>Technical Blogs • Hindi + English</small></h1>
          </div>
          <div className="nav-actions">
            <input className="search" placeholder="🔍 Search blogs..." value={search} onChange={e=>setSearch(e.target.value)} />
            <button className="btn btn-primary" onClick={startNew}>✍️ Likho</button>
          </div>
        </div>
      </header>

      <div className="container">
        <section className="hero">
          <div className="badge">⚛️ React se bana • 💾 Auto-save browser me</div>
          <h2>Technical Blogs, <span className="grad">Simple Hindi me.</span></h2>
          <p>React, JavaScript, Python, AI — sab kuch easy language me seekho. Aur khud bhi <b>“Likho”</b> button dabakar apna blog publish karo.</p>
          <div className="stats">
            <div className="stat"><b>{blogs.length}</b>Total Blogs</div>
            <div className="stat"><b>{CATEGORIES.length-1}</b>Categories</div>
            <div className="stat"><b>100% Free</b>No login needed</div>
          </div>
        </section>

        <div className="filters">
          {CATEGORIES.map(c=>(
            <button key={c} className={"chip"+(cat===c?" active":"")} onClick={()=>setCat(c)}>{c}</button>
          ))}
          <span style={{marginLeft:"auto"}} className="hint">{filtered.length} blogs mile • <a href="#" onClick={(e)=>{e.preventDefault(); resetDemo();}} style={{color:"#38bdf8"}}>reset demo</a></span>
        </div>

        {filtered.length===0 ? (
          <div className="empty"><h3>😕 Kuch nahi mila</h3><p>Search badlo ya naya blog likho.</p><br/><button className="btn btn-primary" onClick={startNew}>+ Pehla Blog Likho</button></div>
        ) : (
          <div className="grid">
            {filtered.map(b=>(
              <article key={b.id} className="card" onClick={()=>setOpenId(b.id)}>
                <div className="card-cover">{b.cover||"📝"}</div>
                <div className="card-body">
                  <div className="card-cat">{b.category} • {b.readTime} min read</div>
                  <h3>{b.title}</h3>
                  <p>{b.excerpt}</p>
                  <div className="tags">{(b.tags||[]).slice(0,3).map(t=><span key={t} className="tag">#{t}</span>)}</div>
                  <div className="meta">
                    <div className="dot">{(b.author||"H")[0]}</div>
                    <span>{b.author} • {b.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="footer">Made with ❤️ by <b>Hoshiyar Tech</b> • React + LocalStorage • Apne blogs browser me safe rehte hain</div>
      </div>

      {openBlog && (
        <div className="overlay" onClick={()=>setOpenId(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="card-cat">{openBlog.category} • {openBlog.readTime} min • {openBlog.date}</div>
                <h2>{openBlog.title}</h2>
                <div className="meta"><div className="dot">{(openBlog.author||"H")[0]}</div><span>{openBlog.author}</span></div>
              </div>
              <button className="close" onClick={()=>setOpenId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="content">{renderContent(openBlog.content)}</div>
              <br/>
              <div className="tags">{(openBlog.tags||[]).map(t=><span key={t} className="tag">#{t}</span>)}</div>
              <br/>
              <div className="form-actions" style={{justifyContent:"flex-start"}}>
                <button className="btn btn-ghost btn-small" onClick={()=>startEdit(openBlog)}>✏️ Edit</button>
                <button className="btn btn-danger btn-small" onClick={()=>deleteBlog(openBlog.id)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="overlay" onClick={()=>setEditing(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing==="new" ? "✍️ Naya Blog Likho" : "✏️ Blog Edit Karo"}</h2>
              <button className="close" onClick={()=>setEditing(null)}>✕</button>
            </div>
            <div className="modal-body">
              <form className="form" onSubmit={saveBlog}>
                <div><label>Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ex: React me API kaise call kare?" /></div>
                <div className="row2">
                  <div><label>Category</label>
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                      {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label>Author</label><input value={form.author} onChange={e=>setForm({...form,author:e.target.value})} /></div>
                </div>
                <div><label>Tags (comma se alag karo)</label><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="react, api, hindi" /></div>
                <div><label>Short Excerpt</label><input value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} placeholder="2 line me blog ka summary..." /></div>
                <div><label>Content * (code ke liye ` backtick ` use karo)</label>
                  <textarea value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Apna technical blog yaha likho..." />
                </div>
                <div className="hint">💡 Tip: `code` likhne se highlight hoga. Content auto-save nahi — Publish dabana mat bhoolo.</div>
                <div className="form-actions">
                  <button type="button" className="btn btn-ghost" onClick={()=>setEditing(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">🚀 Publish</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// `code` ko highlight karke render karo
function renderContent(text) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1,-1)}</code>;
    return <span key={i}>{p}</span>;
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
