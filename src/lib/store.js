import { useState, useEffect } from "react";
import { SEED_BLOGS, COVERS, CAT_COVER } from "./seed";

const KEY = "hoshiyar_tech_blogs_v22";
const OLD_KEYS = ["hoshiyar_tech_blogs_v21", "hoshiyar_tech_blogs_v20", "hoshiyar_tech_blogs_v19", "hoshiyar_tech_blogs_v18", "hoshiyar_tech_blogs_v17", "hoshiyar_tech_blogs_v16", "hoshiyar_tech_blogs_v15", "hoshiyar_tech_blogs_v14", "hoshiyar_tech_blogs_v13", "hoshiyar_tech_blogs_v12", "hoshiyar_tech_blogs_v11", "hoshiyar_tech_blogs_v10", "hoshiyar_tech_blogs_v9", "hoshiyar_tech_blogs_v8", "hoshiyar_tech_blogs_v7", "hoshiyar_tech_blogs_v6", "hoshiyar_tech_blogs_v5", "hoshiyar_tech_blogs_v4", "hoshiyar_tech_blogs_v3", "hoshiyar_tech_blogs_v2", "hoshiyar_tech_blogs"];
const isSeedId = (id) => /^b\d{1,2}$/.test(id || "");

function dedupe(list) {
  // Same id ya same title+excerpt do baar na dikhe (purane cache se double fix)
  const seenId = new Set();
  const seenText = new Set();
  return (list || []).filter((b) => {
    if (!b || !b.id) return false;
    const t = ((b.title || "") + "||" + (b.excerpt || "")).toLowerCase().trim();
    if (seenId.has(b.id) || (t.length > 10 && seenText.has(t))) return false;
    seenId.add(b.id);
    if (t.length > 10) seenText.add(t);
    return true;
  });
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return dedupe(arr);
    }
    // Purani site se sirf USER ke khud likhe blogs lao (purane samples nahi)
    for (const k of OLD_KEYS) {
      try {
        const arr = JSON.parse(localStorage.getItem(k) || "[]");
        if (Array.isArray(arr)) {
          const mine = arr.filter((b) => b && !isSeedId(b.id));
          if (mine.length) return dedupe([...mine, ...SEED_BLOGS]);
        }
      } catch {}
    }
  } catch {}
  return SEED_BLOGS;
}

export function calcReadTime(md) {
  const words = (md || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export function useBlogs() {
  const [blogs, setBlogs] = useState(read);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(blogs)); } catch {}
  }, [blogs]);

  function create(data) {
    const b = {
      id: "b" + Date.now(),
      cover: CAT_COVER[data.category] || COVERS[Math.floor(Math.random() * COVERS.length)],
      date: new Date().toISOString().slice(0, 10),
      readTime: calcReadTime(data.content),
      ...data,
    };
    setBlogs((prev) => [b, ...prev]);
    return b;
  }

  function update(id, data) {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, ...data, readTime: calcReadTime(data.content) } : b
      )
    );
  }

  function remove(id) {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  }

  function reset() {
    setBlogs(SEED_BLOGS);
  }

  return { blogs, create, update, remove, reset };
}
