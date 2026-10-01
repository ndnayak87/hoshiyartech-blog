import { Link } from "react-router-dom";

export function RequireAdmin({ isAdmin, children }) {
  if (!isAdmin) {
    return (
      <div className="container narrow center-box">
        <h2>🔒 Admin only</h2>
        <p className="muted">Article likhne / edit / delete ke liye pehle login karo.</p>
        <br />
        <Link className="btn btn-primary" to="/login">Login Page par jao</Link>
      </div>
    );
  }
  return children;
}
