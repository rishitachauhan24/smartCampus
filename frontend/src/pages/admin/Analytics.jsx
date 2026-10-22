import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/analytics");
      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="loading">Loading analytics…</div>;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  if (!analytics) return null;

  const summary = analytics.summary || {};

  // Helper: compute max count for bar widths
  const maxCount = (arr) =>
    arr && arr.length > 0 ? Math.max(...arr.map((i) => i.count), 1) : 1;

  const catMax = maxCount(analytics.categoryStats);
  const priMax = maxCount(analytics.priorityStats);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Campus Analytics</h1>
          <p>Overview of campus problems and their current status.</p>
        </div>
        <button className="btn btn-primary" onClick={fetchAnalytics}>
          🔄 Refresh
        </button>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <span>Total Issues</span>
          <strong>{summary.totalIssues || 0}</strong>
        </div>
        <div className="analytics-card">
          <span>Pending</span>
          <strong>{summary.pending || 0}</strong>
        </div>
        <div className="analytics-card">
          <span>Assigned</span>
          <strong>{summary.assigned || 0}</strong>
        </div>
        <div className="analytics-card">
          <span>In Progress</span>
          <strong>{summary.inProgress || 0}</strong>
        </div>
        <div className="analytics-card">
          <span>Resolved</span>
          <strong>{summary.resolved || 0}</strong>
        </div>
      </div>

      {/* ===== CATEGORY ===== */}
      <div className="analytics-section">
        <h2>Issues by Category</h2>
        <div className="analytics-list">
          {(analytics.categoryStats || []).map((item) => (
            <div className="analytics-row" key={item._id}>
              <span className="analytics-row-label">{item._id}</span>
              <div className="analytics-bar-wrap">
                <div
                  className="analytics-bar"
                  style={{ width: `${Math.round((item.count / catMax) * 100)}%` }}
                />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
          {(!analytics.categoryStats || analytics.categoryStats.length === 0) && (
            <p style={{ color: "#9aa8b8", padding: "12px 0" }}>No data yet.</p>
          )}
        </div>
      </div>

      {/* ===== PRIORITY ===== */}
      <div className="analytics-section">
        <h2>Issues by Priority</h2>
        <div className="analytics-list">
          {(analytics.priorityStats || []).map((item) => (
            <div className="analytics-row" key={item._id}>
              <span className="analytics-row-label">
                <StatusBadge type="priority" value={item._id} />
              </span>
              <div className="analytics-bar-wrap">
                <div
                  className="analytics-bar"
                  style={{
                    width: `${Math.round((item.count / priMax) * 100)}%`,
                    background: item._id === "Critical"
                      ? "linear-gradient(90deg,#e11d48,#f87171)"
                      : item._id === "High"
                      ? "linear-gradient(90deg,#dc2626,#fca5a5)"
                      : item._id === "Medium"
                      ? "linear-gradient(90deg,#d97706,#fcd34d)"
                      : "linear-gradient(90deg,#059669,#6ee7b7)",
                  }}
                />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
          {(!analytics.priorityStats || analytics.priorityStats.length === 0) && (
            <p style={{ color: "#9aa8b8", padding: "12px 0" }}>No data yet.</p>
          )}
        </div>
      </div>

      {/* ===== LOCATIONS ===== */}
      <div className="analytics-section">
        <h2>Top Locations</h2>
        <div className="analytics-list">
          {(analytics.locationStats || []).map((item) => (
            <div className="analytics-row-simple" key={item._id}>
              <span>📍 {item._id}</span>
              <strong>{item.count} issues</strong>
            </div>
          ))}
          {(!analytics.locationStats || analytics.locationStats.length === 0) && (
            <p style={{ color: "#9aa8b8", padding: "12px 0" }}>No data yet.</p>
          )}
        </div>
      </div>

      {/* ===== RECENT ACTIVITY ===== */}
      <div className="analytics-section">
        <h2>Recent Activity</h2>
        <div className="analytics-list">
          {(analytics.recentActivities || []).map((activity) => (
            <div className="activity-row" key={activity._id}>
              <div>
                <strong>{activity.action}</strong>
                <p>{activity.details || ""}</p>
              </div>
              <small>
                {new Date(activity.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          ))}
          {(!analytics.recentActivities || analytics.recentActivities.length === 0) && (
            <p style={{ color: "#9aa8b8", padding: "12px 0" }}>No recent activity.</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Analytics;