// import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import LoginPage from "./pages/login.jsx"; // Assuming LoginPage should be here
import MainPage from "./pages/main.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Home from "./pages/home.jsx";
import Torque from "./pages/torque.jsx";
import Genealogy from "./pages/Gen.jsx";
import StationStatus from "./pages/StationStatus.jsx";

import { LineStationProvider } from "./pages/LineStationContext.jsx";
import { SerialNumberProvider } from "./pages/SerialNumberContext.jsx";

const App = () => (
  <AuthProvider>
    <LineStationProvider>
      <SerialNumberProvider>
        <Router>
          <Routes>
            {/* Ensure LoginPage Route is included */}
            <Route path="/login" element={<LoginPage />} />

            {/* Main Page Route */}
            <Route path="/" element={<MainPage />} />

            {/* Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Station Status Route */}
            <Route
              path="/StationStatus"
              element={
                <ProtectedRoute>
                  <StationStatus />
                </ProtectedRoute>
              }
            />

            {/* Genealogy Route */}
            <Route
              path="/Gen"
              element={
                <ProtectedRoute>
                  <Genealogy />
                </ProtectedRoute>
              }
            />

            {/* Home Route */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Torque Route */}
            <Route
              path="/torque"
              element={
                <ProtectedRoute>
                  <Torque />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </SerialNumberProvider>
    </LineStationProvider>
  </AuthProvider>
);

export default App;
