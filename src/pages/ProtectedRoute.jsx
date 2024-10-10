// import React from "react";
// //import { Navigate } from 'react-router-dom';
// import { Navigate, useLocation } from "react-router-dom";

// import { useAuth } from "./AuthContext.jsx";

// const ProtectedRoute = ({ children }) => {
//   const { isLoggedIn } = useAuth();
//   // return isLoggedIn ? children : <Navigate to="/login" />;
//   const location = useLocation();

//   return isLoggedIn ? (
//     children
//   ) : (
//     <Navigate to="/login" state={{ from: location.pathname }} />
//   );
// };

// export default ProtectedRoute;

// ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const pathAfterSlash = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;

  const { user } = useAuth(); // Get the user from AuthContext

  return user.username == pathAfterSlash && pathAfterSlash != "login" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
