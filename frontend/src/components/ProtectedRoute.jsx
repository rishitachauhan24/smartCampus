import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    roles &&
    !roles.includes(user.role)
  ) {
    if (user.role === "student") {
      return <Navigate to="/student" replace />;
    }

    if (user.role === "staff") {
      return <Navigate to="/staff" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;