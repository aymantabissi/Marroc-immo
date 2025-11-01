import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children, showSidebar = false, showFooter = false }) {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar دائم */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar فقط إذا مطلوب */}
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>

      {/* Footer فقط إذا مطلوب */}
      {showFooter && <Footer />}
    </div>
  );
}
