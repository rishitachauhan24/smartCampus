import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, getAssetUrl } from "../../services/api";
import StatusBadge from "../../components/StatusBadge";
import StatusTimeline from "../../components/StatusTimeline";

function StaffIssueDetails() {
  const { id } = useParams();

  const [issue, setIssue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchIssue = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(`/issues/${id}`);

      setIssue(data.issue);
    } catch (err) {
      setError(
        err.message || "Failed to load issue."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);


  // AI analysis
  const handleAIAnalyze = async () => {
    try {
      setAiLoading(true);
      setError("");
      setSuccess("");

      const data = await apiRequest(
        `/issues/${id}/ai-analyze`,
        {
          method: "POST",
        }
      );

      setIssue(data.issue);

      setSuccess(
        "AI analysis completed successfully."
      );

    } catch (err) {
      setError(
        err.message?.includes("GEMINI_API_KEY")
          ? "AI is not configured on the backend. Add a valid GEMINI_API_KEY and restart the backend."
          : err.message || "AI analysis failed. Check that the backend and Gemini service are available."
      );
    } finally {
      setAiLoading(false);
    }
  };


  // Update status
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      setStatusLoading(true);
      setError("");
      setSuccess("");

      const data = await apiRequest(
        `/issues/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      setIssue(data.issue);

      setSuccess(
        `Issue status changed to ${newStatus}.`
      );

    } catch (err) {
      setError(
        err.message || "Failed to update status."
      );
    } finally {
      setStatusLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="loading">
        Loading issue...
      </div>
    );
  }


  if (error && !issue) {
    return (
      <div className="page-container">

        <div className="error-box">
          {error}
        </div>

        <Link
          to="/staff/issues"
          className="back-link"
        >
          ← Back to Assigned Issues
        </Link>

      </div>
    );
  }


  if (!issue) {
    return (
      <div className="page-container">

        <div className="empty-box">
          Issue not found.
        </div>

      </div>
    );
  }


  return (
    <div className="page-container">

      <Link
        to="/staff/issues"
        className="back-link"
      >
        ← Back to Assigned Issues
      </Link>


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {success && (
        <div className="success-box">
          {success}
        </div>
      )}


      <div className="details-card">

        {/* Header */}

        <div className="details-header">

          <div>
            <h1>{issue.title}</h1>
            <p>
              Reported on{" "}
              {new Date(issue.createdAt).toLocaleString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <StatusBadge type="status" value={issue.status} />
            <StatusBadge type="priority" value={issue.priority} />
          </div>

        </div>

        {/* Status Timeline */}
        <div style={{ padding: "20px 0 10px", borderBottom: "1px solid #e1e7ee", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#687689", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>Issue Progress</p>
          <StatusTimeline currentStatus={issue.status} />
        </div>


        {/* Description */}

        <div className="details-section">

          <h3>
            Description
          </h3>

          <p>
            {issue.description}
          </p>

        </div>


        {/* Issue information */}

        <div className="details-grid">

          <div>
            <strong>
              Category
            </strong>

            <p>
              {issue.category}
            </p>
          </div>


          <div>
            <strong>
              Location
            </strong>

            <p>
              {issue.location}
            </p>
          </div>


          <div>
            <strong>
              Priority
            </strong>

            <p>
              <StatusBadge type="priority" value={issue.priority} />
            </p>
          </div>


          <div>
            <strong>
              Status
            </strong>

            <p>
              <StatusBadge type="status" value={issue.status} />
            </p>
          </div>

        </div>


        {/* Image */}

        {issue.imageUrl && (

          <div className="details-section">

            <h3>
              Issue Image
            </h3>

            <img
              src={getAssetUrl(issue.imageUrl)}
              alt="Reported issue"
              className="issue-image"
            />

          </div>

        )}


        {/* AI section */}

        <div className="staff-action-box">

          <h2>
            AI Issue Analysis
          </h2>

          <p>
            Let AI analyze the issue and suggest
            its category, priority and recommended action.
          </p>

          {!issue.aiSummary && (
            <p className="ai-hint">
              Sign in as staff or admin, then run the analysis to generate suggestions.
            </p>
          )}

          <button
            className="btn btn-primary"
            onClick={handleAIAnalyze}
            disabled={aiLoading}
          >
            {aiLoading
              ? "Analyzing..."
              : "Analyze with AI"}
          </button>

        </div>


        {/* AI results */}

        {(issue.aiSummary ||
          issue.aiSuggestedAction ||
          issue.aiReason) && (

          <div className="ai-box">

            <h3>
              AI Analysis Result
            </h3>


            {issue.aiSummary && (
              <div className="ai-result-item">

                <strong>
                  Summary
                </strong>

                <p>
                  {issue.aiSummary}
                </p>

              </div>
            )}


            {issue.aiSuggestedAction && (
              <div className="ai-result-item">

                <strong>
                  Suggested Action
                </strong>

                <p>
                  {issue.aiSuggestedAction}
                </p>

              </div>
            )}


            {issue.aiReason && (
              <div className="ai-result-item">

                <strong>
                  AI Reason
                </strong>

                <p>
                  {issue.aiReason}
                </p>

              </div>
            )}

          </div>

        )}


        {/* Status management */}

        <div className="staff-action-box">

          <h2>
            Manage Issue
          </h2>

          <div className="form-group">

            <label htmlFor="issue-status">
              Update Status
            </label>

            <select
              id="issue-status"
              value={issue.status}
              onChange={handleStatusChange}
              disabled={statusLoading}
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>

            </select>

          </div>

        </div>

      </div>

    </div>
  );
}

export default StaffIssueDetails;