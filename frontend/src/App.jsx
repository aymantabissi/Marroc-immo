import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// ✅ Pages Auth
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";      // <--- ADD
import ResetPassword from "./pages/ResetPassword";        // <--- ADD

// ✅ Admin / Client Pages
import ListeAnnonces from "./pages/ListeAnnonces";
import ModifierAnnonce from "./pages/ModifierAnnonce";
import DetailsAnnonce from "./pages/DetailsAnnonce";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Contact from "./pages/Contact";

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (requiredRole && role !== requiredRole) return <Navigate to="/login" replace />;

  return children;
}

function DefaultRedirect() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/client/home" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />   {/* <--- ADD */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* <--- ADD */}

        {/* -------- ADMIN ROUTES -------- */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout showSidebar={true} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="annonces" element={<ListeAnnonces />} />
          <Route path="annonces/modifier/:id" element={<ModifierAnnonce />} />
          <Route path="annonces/:id" element={<DetailsAnnonce />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* -------- CLIENT ROUTES -------- */}
        <Route
          path="/client/*"
          element={
            <ProtectedRoute requiredRole="client">
              <Layout showSidebar={false} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="annonces/:id" element={<DetailsAnnonce />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* -------- DEFAULT & CATCH-ALL -------- */}
        <Route path="/" element={<DefaultRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
