import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import StatusBadge from "../components/StatusBadge";

const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

function CampusStatus() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await apiRequest("/public/issues");
        const sorted = (data.issues || []).sort(
          (a, b) =>
            (PRIORITY_ORDER[a.priority] ?? 9) -
            (PRIORITY_ORDER[b.priority] ?? 9)
        );
        setIssues(sorted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) return <Loading text="Loading campus status…" />;

  const categories = ["All", ...new Set(issues.map((i) => i.category))];

  const displayed =
    filter === "All" ? issues : issues.filter((i) => i.category === filter);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Campus Status</h1>
          <p>Currently unresolved campus issues — sorted by priority.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-small ${filter === cat ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />

      {!error && displayed.length === 0 && (
        <div className="empty-box">
          <h2>✅ No Active Issues</h2>
          <p>There are currently no unresolved campus problems. Great work!</p>
        </div>
      )}

      <div className="issue-grid">
        {displayed.map((issue) => (
          <div className="issue-card campus-status-card" key={issue._id}>

            <div className="issue-card-top">
              <h3>{issue.title}</h3>
              <StatusBadge type="priority" value={issue.priority} />
            </div>

            <div className="issue-info">
              <span>📂 {issue.category}</span>
              <span>📍 {issue.location}</span>
              <span>
                🗓️ {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <StatusBadge type="status" value={issue.status} />

          </div>
        ))}
      </div>

    </div>
  );
}

export default CampusStatus;