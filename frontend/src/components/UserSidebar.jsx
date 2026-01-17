import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

const getCurrentUserName = () => {
  const token =
    localStorage.getItem("userToken") || localStorage.getItem("adminToken");
  if (!token) return null;
  try {
    const user = JSON.parse(atob(token.split(".")[1]));
    return user.name || null;
  } catch {
    return null;
  }
};

const UserSidebar = () => {
  const navigate = useNavigate();
  const currentName = getCurrentUserName();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", icon: "📚", label: "My Subjects", end: true },
    { to: "/dashboard/files", icon: "📁", label: "My Files" },
    { to: "/dashboard/groups", icon: "👥", label: "My Groups" },
    { to: "/dashboard/trash", icon: "🗑️", label: "Trash" },
    { to: "/dashboard/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-8 px-6 flex flex-col fixed left-0 top-0 shadow-xl z-50">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold m-0 mb-2 text-white">
          Ping<span className="text-yellow-400">notes</span>
        </h2>
        <p className="text-sm opacity-80 m-0 font-medium">
          {currentName ? `Welcome, ${currentName}` : "Student Dashboard"}
        </p>
      </div>

      <nav className="flex-1">
        <ul className="list-none p-0 m-0">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-4 py-4 px-5 mb-2 rounded-lg cursor-pointer transition-all duration-300 font-medium no-underline text-white hover:bg-white/10 hover:translate-x-1 ${
                    isActive ? "bg-white/20 shadow-md" : ""
                  }`
                }
              >
                <span className="text-xl w-6 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-8 border-t border-white/10">
        <button
          className="w-full flex items-center gap-4 py-4 px-5 bg-red-500/80 text-white border-none rounded-lg cursor-pointer transition-all duration-300 font-medium text-base hover:bg-red-500 hover:-translate-y-0.5 hover:shadow-lg"
          onClick={handleLogout}
        >
          <span className="text-xl w-6 text-center">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
