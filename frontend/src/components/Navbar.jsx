import { useState } from "react";
import { Bell, ChevronDown, User, Settings, Plus, LogOut } from "lucide-react";

export default function Navbar({ pageName = "Tableau de Bord" }) {
  const name = "Utilisateur";
  const role = "client";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-3 w-64">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-xl font-bold">MI</span>
        </div>
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold">MarocImmo</h2>
          <p className="text-xs text-gray-400 capitalize">{role}</p>
        </div>
      </div>

      {/* Center: Dynamic Page Name */}
      <div className="flex-1 flex justify-center">
        <h1 className="text-xl font-bold tracking-tight">{pageName}</h1>
      </div>

      {/* Right: Notifications + User Menu */}
      <div className="flex items-center gap-4 w-64 justify-end">
        {/* Notification Icon */}
        <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-all duration-200 group">
          <Bell className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="Avatar utilisateur"
              className="w-8 h-8 rounded-full border-2 border-blue-500"
            />
            <span className="font-medium hidden md:block">{name}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl py-2 z-20 border border-gray-700">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{role}</p>
                </div>
                
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors group"
                  >
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    <span>Nouveau projet</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors group"
                  >
                    <User className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    <span>Profil</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-700 transition-colors group"
                  >
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                    <span>Paramètres</span>
                  </a>
                </div>

                <div className="border-t border-gray-700 pt-2">
                  <button
                    onClick={() => {
                      window.location.href = "/login";
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors w-full group"
                  >
                    <LogOut className="w-4 h-4 group-hover:text-red-300" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}