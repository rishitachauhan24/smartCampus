import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, getAssetUrl } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import StatusTimeline from "../../components/StatusTimeline";

function IssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [error, setError] = useState("");

  const generateSuggestions = useCallback(async (issueId) => {
    try {
      setAiLoading(true);
      setAiError("");
      const data = await apiRequest(`/issues/${issueId}/ai-suggestions`, {
        method: "POST",
      });
      setIssue(data.issue);
    } catch (err) {
      setAiError(
        err.message?.includes("GEMINI_API_KEY")
          ? "AI suggestions unavailable — backend is missing Gemini API key."
          : err.message || "Could not generate AI suggestions."
      );
    } finally {
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const data = await apiRequest(`/issues/${id}`);
        setIssue(data.issue);
        if (!data.issue.aiSummary || !data.issue.aiSuggestedAction) {
          generateSuggestions(id);
        }
      } catch (err) {
        setError(err.message || "Failed to load issue.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id, generateSuggestions]);

  if (loading) {
    return (
      <div className="loading">
        <span className="loading-spinner" /> Loading issue…
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-box">{error}</div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="page-container">
        <div className="empty-box">Issue not found.</div>
      </div>
    );
  }

  return (
    <div className="page-container">

      <Link to="/student/issues" className="back-link">
        ← Back to My Issues
      </Link>

      {/* ===== STATUS BANNER ===== */}
      <div className="issue-status-banner">
        <div className="issue-status-banner-left">
          <h1>{issue.title}</h1>
          <p style={{ color: "#c8dde6", marginTop: 6, fontSize: 14 }}>
            Reported on{" "}
            {new Date(issue.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <StatusBadge type="status" value={issue.status} />
          <StatusBadge type="priority" value={issue.priority} />
        </div>
      </div>

      {/* ===== TIMELINE ===== */}
      <div className="details-card" style={{ marginBottom: 20, padding: "24px 28px" }}>
        <h3 style={{ marginBottom: 20, fontSize: 16 }}>Issue Progress</h3>
        <StatusTimeline currentStatus={issue.status} />
        {issue.assignedTo?.name && (
          <p style={{ marginTop: 16, color: "#19706c", fontWeight: 600, fontSize: 14 }}>
            👤 Assigned to: {issue.assignedTo.name}
          </p>
        )}
        {!issue.assignedTo && (
          <p style={{ marginTop: 16, color: "#9aa8b8", fontSize: 14 }}>
            ⏳ Not yet assigned to any staff member.
          </p>
        )}
      </div>

      {/* ===== DETAILS CARD ===== */}
      <div className="details-card">

        {/* Description */}
        <div className="details-section">
          <h3>Description</h3>
          <p>{issue.description}</p>
        </div>

        {/* Info grid */}
        <div className="details-grid">
          <div>
            <strong>Category</strong>
            <p>{issue.category}</p>
          </div>
          <div>
            <strong>Location</strong>
            <p>{issue.location}</p>
          </div>
          <div>
            <strong>Priority</strong>
            <p><StatusBadge type="priority" value={issue.priority} /></p>
          </div>
          <div>
            <strong>Status</strong>
            <p><StatusBadge type="status" value={issue.status} /></p>
          </div>
          <div>
            <strong>Assigned Staff</strong>
            <p>
              {issue.assignedTo?.name ? (
                <span style={{ color: "#19706c", fontWeight: 600 }}>
                  {issue.assignedTo.name}
                </span>
              ) : (
                <span style={{ color: "#9aa8b8" }}>Not assigned yet</span>
              )}
            </p>
          </div>
          <div>
            <strong>Reported By</strong>
            <p>
              {issue.isAnonymous
                ? "Anonymous"
                : issue.reportedBy?.name || "You"}
            </p>
          </div>
        </div>

        {/* Image */}
        {issue.imageUrl && (
          <div className="details-section">
            <h3>Uploaded Image</h3>
            <img
              src={getAssetUrl(issue.imageUrl)}
              alt="Issue"
              className="issue-image"
            />
          </div>
        )}

        {/* AI box */}
        <div className={`ai-box ${!issue.aiSummary && !aiLoading ? "ai-box-muted" : ""}`}>
          <h3>🤖 AI Problem Summary &amp; Solution</h3>

          {aiLoading && (
            <p aria-live="polite" style={{ color: "#687689" }}>
              <span className="loading-spinner" /> Generating AI summary and solutions…
            </p>
          )}

          {aiError && (
            <div>
              <p className="ai-hint" role="alert">{aiError}</p>
              <button
                className="btn btn-small btn-primary"
                type="button"
                onClick={() => generateSuggestions(id)}
                disabled={aiLoading}
                style={{ marginTop: 10 }}
              >
                Try Again
              </button>
            </div>
          )}

          {issue.aiSummary && (
            <div className="ai-result-item">
              <strong>Summary</strong>
              <p>{issue.aiSummary}</p>
            </div>
          )}

          {issue.aiSuggestedAction && (
            <div className="ai-result-item">
              <strong>Suggested Solution</strong>
              <p>{issue.aiSuggestedAction}</p>
            </div>
          )}

          {!issue.aiSummary && !issue.aiSuggestedAction && !aiLoading && !aiError && (
            <p style={{ color: "#9aa8b8" }}>AI suggestions are not available yet.</p>
          )}
        </div>

      </div>

    </div>
  );
}

export default IssueDetails;