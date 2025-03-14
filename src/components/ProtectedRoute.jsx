import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  return children;
}