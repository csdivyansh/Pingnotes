/*SettingsPage.css file*/
import React from "react";
import { useNavigate } from "react-router-dom";
import DashNav from "./DashNav.jsx";

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <>
      <DashNav />
      <div
        className="subject-card"
        style={{ maxWidth: 400, margin: "4rem auto", textAlign: "center" }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: 32 }}>Settings</h1>
        <button
          className="btn-danger"
          style={{ padding: "12px 32px", fontSize: "1.1rem" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default SettingsPage;
