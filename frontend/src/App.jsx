import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Redirection selon rôle */}
        <Route
          path="/dashboard"
          element={token && role === "admin" ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/home"
          element={token && role === "client" ? <Home /> : <Navigate to="/login" />}
        />

        {/* Route par défaut */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
