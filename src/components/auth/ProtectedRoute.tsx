import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../store/hooks";
 
export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.user?.role);
  const isAllowedRole = role === "admin" || role === "user";
 
  if (!isAuthenticated || !isAllowedRole) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
 
  return <Outlet />;
}
