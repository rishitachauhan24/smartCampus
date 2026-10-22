import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function AssignStaff() {
  const [issues, setIssues] = useState([]);
  const [staff, setStaff] = useState([]);

  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [issueData, staffData] =
        await Promise.all([
          apiRequest("/issues"),
          apiRequest("/issues/staff"),
        ]);

      setIssues(issueData.issues || []);
      setStaff(staffData.staff || []);
    } catch (err) {
      setError(
        err.message || "Failed to load data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAssign = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedIssue) {
      setError("Please select an issue.");
      return;
    }

    if (!selectedStaff) {
      setError("Please select a staff member.");
      return;
    }

    try {
      setAssigning(true);

      await apiRequest(
        `/issues/${selectedIssue}/assign`,
        {
          method: "PATCH",
          body: JSON.stringify({
            staffId: selectedStaff,
          }),
        }
      );

      setSuccess(
        "Issue assigned to staff successfully."
      );

      setSelectedIssue("");
      setSelectedStaff("");

      await fetchData();

    } catch (err) {
      setError(
        err.message || "Failed to assign issue."
      );
    } finally {
      setAssigning(false);
    }
  };


  if (loading) {
    return (
      <div className="loading">
        Loading assignment data...
      </div>
    );
  }


  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <h1>
            Assign Staff
          </h1>

          <p>
            Assign campus issues to staff members.
          </p>
        </div>

      </div>


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


      <div className="form-card">

        <form
          onSubmit={handleAssign}
          className="issue-form"
        >

          {/* Issue */}

          <div className="form-group">

            <label htmlFor="issue">
              Select Issue
            </label>

            <select
              id="issue"
              value={selectedIssue}
              onChange={(e) =>
                setSelectedIssue(e.target.value)
              }
            >

              <option value="">
                Select an issue
              </option>

              {issues.map((issue) => (

                <option
                  key={issue._id}
                  value={issue._id}
                >
                  {issue.title} - {issue.location}
                </option>

              ))}

            </select>

          </div>


          {/* Staff */}

          <div className="form-group">

            <label htmlFor="staff">
              Select Staff
            </label>

            <select
              id="staff"
              value={selectedStaff}
              onChange={(e) =>
                setSelectedStaff(e.target.value)
              }
            >

              <option value="">
                Select staff member
              </option>

              {staff.map((member) => (

                <option
                  key={member._id}
                  value={member._id}
                >
                  {member.name} - {member.email}
                </option>

              ))}

            </select>

          </div>


          <button
            type="submit"
            className="btn btn-primary"
            disabled={assigning}
          >
            {assigning
              ? "Assigning..."
              : "Assign Issue"}
          </button>

        </form>

      </div>


      {/* Staff List */}

      <div className="staff-list-section">

        <h2>
          Available Staff
        </h2>

        <div className="staff-grid">

          {staff.map((member) => (

            <div
              className="staff-card"
              key={member._id}
            >

              <h3>
                {member.name}
              </h3>

              <p>
                {member.email}
              </p>

              {member.department && (
                <p>
                  Department: {member.department}
                </p>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default AssignStaff;