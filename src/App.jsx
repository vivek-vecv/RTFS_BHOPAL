import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './custom.css';
import { AuthProvider } from './pages/AuthContext.jsx';
import LoginComponent from './pages/login.jsx';
import ProtectedRoute from './pages/ProtectedRoute.jsx';
import PDIComponent from './pages/PDI_DefectEntryScreen.jsx';
import PAGComponent from './pages/audit_entry.jsx';
import QGComponent from './pages/Checkmansheet.jsx';
import Toaster from './pages/Toaster.jsx';
import { toast } from 'react-toastify';
import MainDashboard from './pages/MainDashboard.jsx';
import Navbar from './pages/navbar.jsx';
import './assets/custom.css';

const App = () => {
  return (
    // <AuthProvider>
    <>
      <Toaster />

      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/pdi"
            element={
              // <ProtectedRoute>
              <PDIComponent />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/pag"
            element={
              // <ProtectedRoute>
              <PAGComponent />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/qg"
            element={
              // <ProtectedRoute>
              <QGComponent />
              // </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </>
    // </AuthProvider>
  );
};

export default App;
