import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../store/hooks";
 
export default function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const role = useAppSelector((state) => state.auth.user?.role);
 
  if (isAuthenticated && (role === "admin" || role === "user")) {
    return <Navigate to="/" replace />;
  }
 
  return <Outlet />;
}
