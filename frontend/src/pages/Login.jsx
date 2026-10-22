import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form);

      if (user.role === "student")     navigate("/student");
      else if (user.role === "staff")  navigate("/staff");
      else if (user.role === "admin")  navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <span className="eyebrow">WELCOME BACK</span>
        <h1>Login to SmartCampus</h1>
        <p className="auth-subtitle">Use your campus account to continue.</p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="form">

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </button>

        </form>

        <p className="auth-bottom">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;