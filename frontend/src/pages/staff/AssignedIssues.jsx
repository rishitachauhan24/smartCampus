import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import StatusTimeline from "../../components/StatusTimeline";

function AssignedIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/issues");
      setIssues(data.issues || []);
    } catch (err) {
      setError(err.message || "Failed to load assigned issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const FILTERS = ["All", "Assigned", "In Progress", "Resolved"];

  const displayed =
    filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Assigned Issues</h1>
          <p>
            Campus issues assigned to you
            {issues.length > 0 && ` — ${issues.length} total`}.
          </p>
        </div>
        <button className="btn btn-ghost" onClick={fetchIssues}>
          🔄 Refresh
        </button>
      </div>

      {/* Filter tabs */}
      {!loading && !error && issues.length > 0 && (
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {f !== "All" && (
                <span className="filter-count">
                  {issues.filter((i) => i.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="loading">
          <span className="loading-spinner" /> Loading assigned issues…
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {!loading && !error && issues.length === 0 && (
        <div className="empty-box">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2>No Assigned Issues</h2>
          <p>There are currently no issues assigned to you.</p>
        </div>
      )}

      {!loading && !error && issues.length > 0 && displayed.length === 0 && (
        <div className="empty-box">
          <h2>No {filter} Issues</h2>
          <p>No issues with status &ldquo;{filter}&rdquo; are assigned to you.</p>
        </div>
      )}

      {!loading && displayed.length > 0 && (
        <div className="my-issues-list">
          {displayed.map((issue) => (
            <div className="my-issue-card" key={issue._id}>

              <div className="my-issue-header">
                <div className="my-issue-title-row">
                  <h3>{issue.title}</h3>
                  <StatusBadge type="status" value={issue.status} />
                </div>
                <p className="my-issue-desc">{issue.description}</p>
              </div>

              <StatusTimeline currentStatus={issue.status} />

              <div className="my-issue-meta">
                <span>📂 {issue.category}</span>
                <span>📍 {issue.location}</span>
                <span>
                  <StatusBadge type="priority" value={issue.priority} />
                </span>
                <span>
                  🗓️ {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>

              <div className="my-issue-footer">
                <span style={{ fontSize: 13, color: "#687689" }}>
                  Reported by:{" "}
                  <strong>
                    {issue.isAnonymous
                      ? "Anonymous"
                      : issue.reportedBy?.name || "Student"}
                  </strong>
                </span>
                <Link
                  to={`/staff/issues/${issue._id}`}
                  className="btn btn-small btn-primary"
                >
                  View &amp; Manage →
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default AssignedIssues;