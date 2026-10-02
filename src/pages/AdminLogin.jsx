import { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";
import styles from "./AdminLogin.module.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await adminLogin(form);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminData", JSON.stringify(data.admin));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
         <Link to="/" className={styles.brand}>
          <img
            src="/miet.png"
            alt="MIET Kumaon"
            className={styles.logo}
          /> 
        </Link>
        <span className={styles.label}>ADMIN PORTAL</span>
        <h1>Welcome back</h1>
        <p>Sign in to manage registrations and certificates.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              required
            />
          </label>

          <button disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminLogin;
