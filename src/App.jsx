import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { useBlogs } from "./lib/store";
import { analytics, logEvent } from "./lib/firebase";
import { listenForeground } from "./lib/notify";
import Header from "./components/Header";
import { RequireAdmin } from "./components/RequireAdmin";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Write from "./pages/Write";
import Admin from "./pages/Admin";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Shell() {
  const { blogs, create, update, remove, reset } = useBlogs();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const loc = useLocation();

  // Push notification listener (site khuli ho tab)
  useEffect(() => { listenForeground(); }, []);

  // Har page-visit Analytics me (agar configured hai)
  useEffect(() => {
    if (analytics) {
      try { logEvent(analytics, "page_view", { page_path: loc.pathname }); } catch {}
    }
  }, [loc.pathname]);

  function handleReset() {
    if (confirm("Sample articles wapas laaye? Aapke naye articles hat jayenge.")) reset();
  }

  return (
    <>
      <ScrollTop />
      <Header search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home blogs={blogs} search={search} onReset={handleReset} />} />
        <Route path="/post/:id" element={<Post blogs={blogs} onDelete={remove} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/write" element={<RequireAdmin isAdmin={isAdmin}><Write blogs={blogs} onCreate={create} onUpdate={update} /></RequireAdmin>} />
        <Route path="/edit/:id" element={<RequireAdmin isAdmin={isAdmin}><Write blogs={blogs} onCreate={create} onUpdate={update} /></RequireAdmin>} />
        <Route path="/admin" element={<RequireAdmin isAdmin={isAdmin}><Admin blogs={blogs} onDelete={remove} onReset={reset} /></RequireAdmin>} />
        <Route path="*" element={<div className="container narrow center-box"><h2>404 — Page nahi mila</h2></div>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </BrowserRouter>
  );
}
