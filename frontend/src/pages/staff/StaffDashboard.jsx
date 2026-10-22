import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function StaffDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">

      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1>🔧 Welcome, {user?.name || "Staff"}!</h1>
        <p>
          Manage your assigned campus issues and use AI assistance to
          understand problems and resolve them efficiently.
        </p>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="dashboard-icon">📋</div>
          <h2>Assigned Issues</h2>
          <p>
            View all campus issues assigned to you and update their progress
            as you work on resolving them.
          </p>
          <Link to="/staff/issues" className="btn btn-primary">
            View Assigned Issues
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">🤖</div>
          <h2>AI Assistance</h2>
          <p>
            Use AI to analyze issues, understand their priority level, and
            get suggested actions to resolve them faster.
          </p>
          <Link to="/staff/issues" className="btn btn-primary">
            Analyze with AI
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-icon">📊</div>
          <h2>Campus Analytics</h2>
          <p>
            View campus issue statistics and track recent activity to stay
            informed about campus health.
          </p>
          <Link to="/campus-status" className="btn btn-primary">
            View Campus Status
          </Link>
        </div>

      </div>

    </div>
  );
}

export default StaffDashboard;