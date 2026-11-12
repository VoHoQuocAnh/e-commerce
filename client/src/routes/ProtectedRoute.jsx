// client/src/routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { ROUTES } from '../constants/routes';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
