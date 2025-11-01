import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
export default function Home() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "Client";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
     <Layout>
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold mb-6">Bienvenue, {userName} !</h1>
      <p className="mb-6">Vous êtes connecté en tant que client.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Déconnexion
      </button>
    </div>
    </Layout>
  );
}
