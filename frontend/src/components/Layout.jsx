import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ showSidebar = false, showFooter = false }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar toujours présent */}
      <Navbar />

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 overflow-y-auto p-6 ${showSidebar ? "bg-gray-50" : "bg-gray-100"}`}>
          <Outlet /> {/* <-- Ici les pages enfants seront affichées */}
        </main>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
