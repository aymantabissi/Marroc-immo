import { useState } from "react";
import { Home, BarChart, ShoppingCart, Grid, User, ChevronLeft, ChevronRight, Menu } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: BarChart, label: "Dashboard", active: false },
    { icon: ShoppingCart, label: "Orders", active: false },
    { icon: Grid, label: "Products", active: false },
    { icon: User, label: "Customers", active: false },
  ];

  return (
    <div
      className={`relative flex flex-col justify-between h-screen bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 shadow-2xl transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 z-10"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div>
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b border-gray-700 ${!isOpen && "justify-center"}`}>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl p-2 rounded-lg shadow-md flex-shrink-0">
            B
          </div>
          {isOpen && (
            <h1 className="text-xl font-semibold text-white whitespace-nowrap">
              Sidebar
            </h1>
          )}
        </div>

        {/* Links */}
        <nav className="mt-6 px-3 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  item.active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } ${!isOpen && "justify-center"}`}
                title={!isOpen ? item.label : ""}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${item.active ? "" : "group-hover:scale-110 transition-transform"}`} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </a>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className={`border-t border-gray-700 p-4 ${!isOpen && "flex justify-center"}`}>
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/40"
                alt="User avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
            </div>
            <div>
              <p className="font-semibold text-white">mdo</p>
              <p className="text-sm text-gray-400">Admin</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src="https://i.pravatar.cc/40"
              alt="User avatar"
              className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md cursor-pointer hover:scale-110 transition-transform"
              title="mdo - Admin"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;