import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ListeAnnonces from "./pages/ListeAnnonces";
import AjouterAnnonce from "./pages/AjouterAnnonce";
import ModifierAnnonce from "./pages/ModifierAnnonce";
import DetailsAnnonce from "./pages/DetailsAnnonce";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={token && role === "admin" ? <Layout showSidebar={true} /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="annonces" element={<ListeAnnonces />} />
          <Route path="annonces/ajouter" element={<AjouterAnnonce />} />
          <Route path="annonces/modifier/:id" element={<ModifierAnnonce />} />
          <Route path="annonces/:id" element={<DetailsAnnonce />} />
        </Route>

        {/* Client Routes */}
        <Route
          path="/client/*"
          element={token && role === "client" ? <Layout showSidebar={false} /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="annonces/:id" element={<DetailsAnnonce />} />
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={
            token
              ? role === "admin"
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/client/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
