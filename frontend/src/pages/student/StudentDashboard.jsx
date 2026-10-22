import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/api";

const STATUSES = [
  { key: "Pending",     label: "Pending",     cls: "pending",     icon: "⏳" },
  { key: "Assigned",    label: "Assigned",    cls: "assigned",    icon: "👤" },
  { key: "In Progress", label: "In Progress", cls: "in-progress", icon: "🔧" },
  { key: "Resolved",    label: "Resolved",    cls: "resolved",    icon: "✅" },
];

function StudentDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await apiRequest("/issues");
        setIssues(data.issues || []);
      } catch (err) {
        setError(err.message || "Unable to load your issue summary.");
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const countFor = (status) =>
    issues.filter((i) => i.status === status).length;

  return (
    <div className="page-container">

      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1>👋 Welcome, {user?.name || "Student"}!</h1>
        <p>
          Report campus problems and track their progress — all from your
          personal dashboard.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {/* Status Overview */}
      <section className="status-overview" aria-label="Issue status overview">

        <div className="section-heading-row">
          <div>
            <span className="eyebrow" style={{ color: "#19706c" }}>YOUR ACTIVITY</span>
            <h2>Issue Status Overview</h2>
          </div>
          <span className="overview-total">
            {loading ? "Loading…" : `${issues.length} total issue${issues.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        <div className="status-overview-grid">
          {STATUSES.map(({ key, label, cls, icon }) => (
            <div className={`status-overview-item ${cls}`} key={key}>
              <span>{icon} {label}</span>
              <strong>{loading ? "–" : countFor(key)}</strong>
            </div>
          ))}
        </div>

      </section>

      {/* Quick Action Cards */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="dashboard-icon">📝</div>
          <h2>Report an Issue</h2>
          <p>
            Found a problem on campus? Submit a report so the admin can
            assign staff to fix it quickly.
          </p>
          <Link to="/student/report" className="btn btn-primary">
            Report Issue
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">📋</div>
          <h2>My Issues</h2>
          <p>
            View and track all the issues you have reported — see their
            current status and staff updates.
          </p>
          <Link to="/student/issues" className="btn btn-primary">
            View My Issues
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">🏫</div>
          <h2>Campus Status</h2>
          <p>
            Check the current public status of all unresolved campus
            problems reported by students.
          </p>
          <Link to="/campus-status" className="btn btn-primary">
            View Campus Status
          </Link>
        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;