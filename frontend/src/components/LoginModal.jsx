import React, { useRef, useEffect } from "react";
import apiService from "../services/api.js";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const buttonDivRef = useRef(null);
  const navigate = onLoginSuccess;

  useEffect(() => {
    if (isOpen && buttonDivRef.current && window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonDivRef.current, {
        theme: "outline",
        size: "large",
      });
    }
  }, [isOpen]);

  const handleCredentialResponse = async (response) => {
    try {
      const result = await apiService.request("/api/auth/google/onetap", {
        method: "POST",
        body: JSON.stringify({
          credential: response.credential,
          role: "student",
        }),
      });

      localStorage.setItem("userToken", result.token);
      localStorage.setItem("userRole", "user");

      onClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        // Script loaded
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleStudentLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || "";
    const intendedRedirect =
      localStorage.getItem("postLoginRedirect") || "/dashboard";
    window.location.href = `${apiBase}/api/auth/google/user?redirect=${encodeURIComponent(
      intendedRedirect
    )}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "48px 40px",
            maxWidth: 500,
            width: "90%",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#666",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#f0f0f0")}
            onMouseLeave={(e) => (e.target.style.background = "none")}
          >
            ✕
          </button>

          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 12,
              color: "#0a192f",
              textAlign: "center",
            }}
          >
            Student Login
          </h2>

          <p
            style={{
              fontSize: 16,
              color: "#666",
              textAlign: "center",
              marginBottom: 32,
              maxWidth: 400,
            }}
          >
            Sign in with your Google account to access your student dashboard
          </p>

          <button
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 32px",
              fontSize: 16,
              cursor: "pointer",
              marginBottom: 20,
              width: "100%",
              fontWeight: 600,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#333")}
            onMouseLeave={(e) => (e.target.style.background = "#000")}
            onClick={handleStudentLogin}
          >
            Sign in with Google
          </button>

          <div
            ref={buttonDivRef}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 16,
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default LoginModal;
