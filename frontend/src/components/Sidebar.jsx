import { useState } from "react";
import {
  Home,
  BarChart,
  ShoppingCart,
  Grid,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const menuItems = [
    { icon: Home, label: "Home" },
    { icon: BarChart, label: "Dashboard" },
    { icon: ShoppingCart, label: "Gestion des annonces", dropdown: true },
    { icon: Grid, label: "Products" },
    { icon: User, label: "Customers" },
  ];

  const userMenuItems = [
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <div
      className={`relative flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-4 top-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-2 shadow-xl transition-all duration-200 z-10 hover:scale-110"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div
          className={`flex items-center gap-4 p-6 border-b border-slate-700 ${
            !isOpen && "justify-center"
          }`}
        >
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white font-bold text-xl p-3 rounded-2xl shadow-lg flex-shrink-0">
            M
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                MarocImmo
              </h1>
              <p className="text-xs text-slate-400 mt-1">Administration</p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;
            
            return (
              <div key={index}>
                <button
                  onClick={() => {
                    if (item.dropdown) {
                      setIsDropdownOpen(!isDropdownOpen);
                    } else {
                      setActiveItem(item.label);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  } ${!isOpen && "justify-center"}`}
                  title={!isOpen ? item.label : ""}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                        isActive 
                          ? "text-white" 
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    {isOpen && (
                      <span className={`font-medium ${isActive ? "text-white" : "text-slate-300"}`}>
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Chevron for dropdown */}
                  {item.dropdown && isOpen && (
                    <span className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </span>
                  )}
                </button>

                {/* Dropdown submenu */}
                {item.dropdown && isDropdownOpen && isOpen && (
                  <div className="ml-4 mt-2 space-y-1 border-l-2 border-blue-500 pl-4">
                    <a
                      href="#"
                      className="block text-slate-400 hover:text-white hover:bg-slate-700 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-blue-400 transition-colors"></span>
                        Gestion des ventes
                      </span>
                    </a>
                    <a
                      href="#"
                      className="block text-slate-400 hover:text-white hover:bg-slate-700 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-blue-400 transition-colors"></span>
                        Gestion des locations
                      </span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className={`border-t border-slate-700 p-4 bg-slate-800 ${!isOpen && "flex justify-center"}`}>
        {isOpen ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700 transition-all duration-200 cursor-pointer">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="User avatar"
                  className="w-11 h-11 rounded-xl border-2 border-blue-500 shadow-lg"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">mdo</p>
                <p className="text-xs text-slate-400 truncate">Administrator</p>
              </div>
            </div>
            
            {/* User menu items */}
            <div className="space-y-1">
              {userMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.label === "Logout"
                        ? "text-red-400 hover:bg-red-950 hover:text-red-300"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-all ${
                      item.label === "Logout" 
                        ? "" 
                        : "text-slate-400 group-hover:text-white"
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src="https://i.pravatar.cc/40"
              alt="User avatar"
              className="w-11 h-11 rounded-xl border-2 border-blue-500 shadow-lg cursor-pointer hover:scale-110 transition-transform"
              title="mdo - Administrator"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;