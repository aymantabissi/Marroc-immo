import { useEffect, useState } from "react";
import Layout from "../components/Layout";
export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      // Ici on pourrait décoder le token pour afficher les infos
      setUser({ name: "Utilisateur connecté" });
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
     <Layout showSidebar={true} showFooter={true}>
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Bienvenue {user.name}</p>
      <button
        className="bg-red-500 text-white p-2 mt-4 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
    </Layout>
  );
}
