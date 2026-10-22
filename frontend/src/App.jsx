import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CampusStatus from "./pages/CampusStatus";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ReportIssue from "./pages/student/ReportIssue";
import MyIssues from "./pages/student/MyIssues";
import IssueDetails from "./pages/student/IssueDetails";

// Staff pages
import StaffDashboard from "./pages/staff/StaffDashboard";
import AssignedIssues from "./pages/staff/AssignedIssues";
import StaffIssueDetails from "./pages/staff/StaffIssueDetails";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageIssues from "./pages/admin/ManageIssues";
import AssignStaff from "./pages/admin/AssignStaff";
import Analytics from "./pages/admin/Analytics";
import Projects from "./pages/Projects";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import PublicProject from "./pages/PublicProject";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <main className="app-main">

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campus-status" element={<CampusStatus />} />
          <Route path="/share/projects/:slug" element={<PublicProject />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectWorkspace />} />
          </Route>


          {/* ================= STUDENT ROUTES ================= */}

          <Route element={<ProtectedRoute roles={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/report" element={<ReportIssue />} />
            <Route path="/student/issues" element={<MyIssues />} />
            <Route path="/student/issues/:id" element={<IssueDetails />} />
          </Route>


          {/* ================= STAFF ROUTES ================= */}

          <Route element={<ProtectedRoute roles={["staff"]} />}>
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/staff/issues" element={<AssignedIssues />} />
            <Route path="/staff/issues/:id" element={<StaffIssueDetails />} />
          </Route>


          {/* ================= ADMIN ROUTES ================= */}

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/issues" element={<ManageIssues />} />
            <Route path="/admin/assign" element={<AssignStaff />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>


          {/* ================= 404 ================= */}

          <Route
            path="*"
            element={
              <div className="page-container">
                <div className="empty-box">
                  <h2>404 — Page Not Found</h2>
                  <p>The page you are looking for does not exist.</p>
                </div>
              </div>
            }
          />

        </Routes>

      </main>

      <Footer />

    </BrowserRouter>
  );
}

export default App;