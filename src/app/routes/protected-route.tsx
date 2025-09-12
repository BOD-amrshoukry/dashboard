import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../../shared/utils/auth';

interface ProtectedRouteProps {
  isAnonymousRequired?: boolean;
}

export default function ProtectedRoute({
  isAnonymousRequired = false,
}: ProtectedRouteProps) {
  const token = getCookie('token');
  const isAuthenticated = !!token;

  // Prevent authenticated users from visiting anonymous-only pages (e.g., login/register)
  if (isAnonymousRequired) {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
  }

  // Protect private routes
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

