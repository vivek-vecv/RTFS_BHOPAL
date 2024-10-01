import React from "react";
//import { Navigate } from 'react-router-dom';
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "./AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  // return isLoggedIn ? children : <Navigate to="/login" />;
  const location = useLocation();

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} />
  );
};

export default ProtectedRoute;
