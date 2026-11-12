// client/src/routes/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { ROUTES } from '../constants/routes';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
