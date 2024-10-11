import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./custom.css";
import { AuthProvider } from "./pages/AuthContext.jsx";
import LoginComponent from "./pages/login.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import PDIComponent from "./pages/PDI_DefectEntryScreen.jsx";
import PAGComponent from "./pages/audit_entry.jsx";
import QGComponent from "./pages/Checkmansheet.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route
            path="/PDI"
            element={
              <ProtectedRoute>
                <PDIComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/PAG"
            element={
              <ProtectedRoute>
                <PAGComponent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/QG"
            element={
              <ProtectedRoute>
                <QGComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
