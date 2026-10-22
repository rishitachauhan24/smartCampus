import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import StatusTimeline from "../../components/StatusTimeline";

function MyIssues() {
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
      setError(err.message || "Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const FILTERS = ["All", "Pending", "Assigned", "In Progress", "Resolved"];

  const displayed =
    filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>My Issues</h1>
          <p>
            Track all campus problems you have reported
            {issues.length > 0 && ` — ${issues.length} total`}.
          </p>
        </div>
        <Link to="/student/report" className="btn btn-primary">
          + Report New Issue
        </Link>
      </div>

      {/* Status filter tabs */}
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
          <span className="loading-spinner" /> Loading your issues…
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {!loading && !error && issues.length === 0 && (
        <div className="empty-box">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2>No Issues Yet</h2>
          <p style={{ marginBottom: 20 }}>
            You have not reported any campus issue yet.
          </p>
          <Link to="/student/report" className="btn btn-primary">
            Report an Issue
          </Link>
        </div>
      )}

      {!loading && !error && issues.length > 0 && displayed.length === 0 && (
        <div className="empty-box">
          <h2>No {filter} Issues</h2>
          <p>You have no issues with status &ldquo;{filter}&rdquo;.</p>
        </div>
      )}

      {!loading && displayed.length > 0 && (
        <div className="my-issues-list">
          {displayed.map((issue) => (
            <div className="my-issue-card" key={issue._id}>

              {/* Card top */}
              <div className="my-issue-header">
                <div className="my-issue-title-row">
                  <h3>{issue.title}</h3>
                  <StatusBadge type="status" value={issue.status} />
                </div>
                <p className="my-issue-desc">{issue.description}</p>
              </div>

              {/* Status timeline */}
              <StatusTimeline currentStatus={issue.status} />

              {/* Meta row */}
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
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Footer */}
              <div className="my-issue-footer">
                {issue.assignedTo?.name ? (
                  <span className="assigned-to-label">
                    👤 Assigned to <strong>{issue.assignedTo.name}</strong>
                  </span>
                ) : (
                  <span className="not-assigned-label">⏳ Not yet assigned</span>
                )}
                <Link
                  to={`/student/issues/${issue._id}`}
                  className="btn btn-small btn-primary"
                >
                  View Details →
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default MyIssues;