import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Success = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          backgroundColor: "#1a1a1a",
        }}
      >
        <h1 style={{ color: "#27ae60", marginBottom: 16 }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: 18, marginBottom: 32, color: "#e0e0e0" }}>
          Thank you for your purchase. Your plan is now active.
        </p>
        <button
          style={{
            padding: "12px 32px",
            fontSize: 18,
            background: "#27ae60",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onClick={() => navigate("/dashboard")}
          onMouseOver={(e) => (e.target.style.background = "#229954")}
          onMouseOut={(e) => (e.target.style.background = "#27ae60")}
        >
          Go to Dashboard
        </button>
      </div>
    </>
  );
};

export default Success;
