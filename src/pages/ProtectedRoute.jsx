import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const intendedRoute = location.pathname;
  console.log(intendedRoute);

  localStorage.setItem('intendedRoute', intendedRoute);

  const allowedRoutes = {
    admin: ['/', '/pdi', '/pag', '/qg', '/pr'],
    'Quality Inspector': ['/qg'],
    'Product Auditor': ['/pag'],
    'PDI Inspector': ['/pdi'],
    'Post Rollout Inspector': ['/pr'],
  };

  const pathname = location.pathname;

  const hasAccess = user && (user.roles.includes('admin') || allowedRoutes[user.roles[0]]?.includes(pathname));
  return hasAccess ? children : <Navigate to="/login" state={{ from: location.pathname }} />;
};

export default ProtectedRoute;
