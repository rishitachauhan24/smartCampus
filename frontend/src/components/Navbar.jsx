import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  let dashboardPath = "/";
  if (user?.role === "student") dashboardPath = "/student";
  if (user?.role === "staff")   dashboardPath = "/staff";
  if (user?.role === "admin")   dashboardPath = "/admin";

  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <span className="brand-mark">S</span>
        <span>SmartCampus</span>
      </Link>

      {/* Hamburger toggle */}
      <button
        className={`nav-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={isActive("/")} onClick={closeMenu}>
          Home
        </Link>

        <Link
          to="/campus-status"
          className={isActive("/campus-status")}
          onClick={closeMenu}
        >
          Campus Status
        </Link>

        {user && (
          <Link
            to={dashboardPath}
            className={isActive(dashboardPath)}
            onClick={closeMenu}
          >
            Dashboard
          </Link>
        )}

        {user && (
          <Link
            to="/projects"
            className={isActive("/projects")}
            onClick={closeMenu}
          >
            Projects
          </Link>
        )}

        {!user ? (
          <>
            <Link
              to="/login"
              className={`nav-login ${isActive("/login")}`}
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="nav-register"
              onClick={closeMenu}
            >
              Register
            </Link>
          </>
        ) : (
          <div className="nav-user">
            <span>{user.name}</span>
            <span className="role-pill">{user.role}</span>
            <button
              onClick={handleLogout}
              className="btn btn-small btn-outline"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;