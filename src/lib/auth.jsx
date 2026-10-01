import { createContext, useContext, useState, useEffect } from "react";

const AUTH_KEY = "ht_admin_auth";
const CRED_KEY = "ht_admin_cred";

// Default admin — demo password HATA diya gaya hai.
// Asli password deploy ke baad owner ke paas private me hai.
const DEFAULT_CRED = { username: "admin", password: "Hoshiyar#Tech!2026" };

function readCred() {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_CRED;
}

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return localStorage.getItem(AUTH_KEY) || null; } catch { return null; }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(AUTH_KEY, user);
      else localStorage.removeItem(AUTH_KEY);
    } catch {}
  }, [user]);

  function login(username, password) {
    const cred = readCred();
    if (username.trim() === cred.username && password === cred.password) {
      setUser(username.trim());
      return { ok: true };
    }
    return { ok: false, error: "Galat username ya password!" };
  }

  function logout() { setUser(null); }

  function changePassword(oldPw, newPw) {
    const cred = readCred();
    if (oldPw !== cred.password) return { ok: false, error: "Purana password galat hai!" };
    if (!newPw || newPw.length < 6) return { ok: false, error: "Naya password kam se kam 6 character ka ho!" };
    try { localStorage.setItem(CRED_KEY, JSON.stringify({ ...cred, password: newPw })); } catch {}
    return { ok: true };
  }

  return (
    <AuthCtx.Provider value={{ user, isAdmin: !!user, login, logout, changePassword }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
