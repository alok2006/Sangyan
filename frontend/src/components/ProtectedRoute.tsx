import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Assuming you have a LoadingSpinner component
import LoadingSpinner from './LoadingSpinner'; 

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // CRITICAL FIX: Destructure the correct, refactored context variables
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900">
        {/* Placeholder for your actual LoadingSpinner component */}
        <LoadingSpinner />
      </div>
    );
  }

  // CRITICAL FIX: Check the isAuthenticated flag
  if (!isAuthenticated) {
    // Navigate to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children (the protected content) if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;