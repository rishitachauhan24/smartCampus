import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate("/student");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <span className="eyebrow">JOIN SMARTCAMPUS</span>
        <h1>Create your account</h1>

        <div className="auth-info">
          🎓 New registrations are created as student accounts.
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="form">

          <label>
            Full Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              autoComplete="name"
            />
          </label>

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
              placeholder="Minimum 6 characters"
              required
              autoComplete="new-password"
            />
          </label>

          <label>
            Department <span style={{ fontWeight: 400, color: "#9aa8b8" }}>(optional)</span>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. BCA, B.Tech, MBA"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary full-width"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

        </form>

        <p className="auth-bottom">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;