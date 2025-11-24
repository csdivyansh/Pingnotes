import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserSidebar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <aside className="user-sidebar">
      <div className="sidebar-header">
        <h2>
          Ping<span>Notes</span>
        </h2>
        <p className="user-role">Admin Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item active">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📝</span>
            <span>Notes</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">👤</span>
            <span>Users</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">👨‍🏫</span>
            <span>Teachers</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">👥</span>
            <span>Groups</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📚</span>
            <span>Subjects</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">🗂️</span>
            <span>Files</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">🛡️</span>
            <span>Admins</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar; 