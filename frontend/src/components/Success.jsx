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
        }}
      >
        <h1 style={{ color: "#27ae60", marginBottom: 16 }}>
          Payment Successfull!
        </h1>
        <p style={{ fontSize: 18, marginBottom: 32 }}>
          Thank you for your purchase. Your plan is now active.
        </p>
        <button
          style={{
            padding: "12px 32px",
            fontSize: 18,
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </>
  );
};

export default Success;
