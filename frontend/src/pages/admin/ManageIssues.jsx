import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";

function ManageIssues() {
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

  const STATUSES = ["All", "Pending", "Assigned", "In Progress", "Resolved"];

  const displayed =
    filter === "All" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Manage Issues</h1>
          <p>
            View and manage all campus issues
            {issues.length > 0 && ` — ${issues.length} total`}.
          </p>
        </div>
        <button className="btn btn-primary" onClick={fetchIssues}>
          🔄 Refresh
        </button>
      </div>

      {/* Status filter */}
      {!loading && !error && issues.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`btn btn-small ${filter === s ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="loading">Loading issues…</div>
      )}

      {error && (
        <div className="error-box">{error}</div>
      )}

      {!loading && !error && displayed.length === 0 && (
        <div className="empty-box">
          <h2>No Issues Found</h2>
          <p>
            {filter === "All"
              ? "There are currently no reported issues."
              : `No issues with status "${filter}".`}
          </p>
        </div>
      )}

      {!loading && !error && displayed.length > 0 && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((issue) => (
                <tr key={issue._id}>
                  <td>
                    <strong style={{ fontSize: 14 }}>{issue.title}</strong>
                  </td>
                  <td>{issue.category}</td>
                  <td>{issue.location}</td>
                  <td>
                    <StatusBadge type="priority" value={issue.priority} />
                  </td>
                  <td>
                    <StatusBadge type="status" value={issue.status} />
                  </td>
                  <td>
                    {issue.assignedTo?.name ? (
                      <span style={{ color: "#19706c", fontWeight: 600 }}>
                        {issue.assignedTo.name}
                      </span>
                    ) : (
                      <span style={{ color: "#9aa8b8" }}>Not Assigned</span>
                    )}
                  </td>
                  <td style={{ color: "#687689" }}>
                    {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default ManageIssues;