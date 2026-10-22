import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">

      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1>🛡️ Welcome, {user?.name || "Admin"}!</h1>
        <p>
          Manage campus issues, assign staff members, and monitor campus
          performance through analytics.
        </p>
      </div>

      <div className="dashboard-cards">

        {/* Manage Issues */}
        <div className="dashboard-card">
          <div className="dashboard-icon">🛠️</div>
          <h2>Manage Issues</h2>
          <p>
            View all reported campus issues, check their status, assigned
            staff, and manage priorities.
          </p>
          <Link to="/admin/issues" className="btn btn-primary">
            Manage Issues
          </Link>
        </div>

        {/* Assign Staff */}
        <div className="dashboard-card">
          <div className="dashboard-icon">👨‍💼</div>
          <h2>Assign Staff</h2>
          <p>
            Assign reported campus issues to available and qualified staff
            members with one click.
          </p>
          <Link to="/admin/assign" className="btn btn-primary">
            Assign Staff
          </Link>
        </div>

        {/* Analytics */}
        <div className="dashboard-card">
          <div className="dashboard-icon">📊</div>
          <h2>Analytics</h2>
          <p>
            View detailed issue statistics by category, priority, location
            and recent campus activity.
          </p>
          <Link to="/admin/analytics" className="btn btn-primary">
            View Analytics
          </Link>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;