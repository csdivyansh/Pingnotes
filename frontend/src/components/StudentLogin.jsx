/*StudentLogin.jsx file */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api.js";
import Navbar from "./Navbar";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

function StudentLogin() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const buttonDivRef = useRef(null);

  // Check for existing token on component mount
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken || adminToken) {
      // Validate token by making a simple API call
      validateTokenAndRedirect(userToken || adminToken);
    }
  }, []);

  const validateTokenAndRedirect = async (token) => {
    try {
      // Make a simple API call to validate the token
      const response = await fetch("/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Token is valid, redirect to appropriate dashboard
        const adminToken = localStorage.getItem("adminToken");
        if (adminToken) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminToken");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      // Token validation failed, remove it
      localStorage.removeItem("userToken");
      localStorage.removeItem("adminToken");
    }
  };

  useEffect(() => {
    if (
      showModal &&
      buttonDivRef.current &&
      window.google &&
      GOOGLE_CLIENT_ID
    ) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(buttonDivRef.current, {
        theme: "outline",
        size: "large",
      });
      // Optionally show One Tap
      // window.google.accounts.id.prompt();
    }
  }, [showModal]);

  const handleCredentialResponse = async (response) => {
    try {
      // Send the JWT token to backend for verification and login
      const result = await apiService.request("/api/auth/google/onetap", {
        method: "POST",
        body: JSON.stringify({
          credential: response.credential,
          role: "student",
        }),
      });

      // Store the token for student
      localStorage.setItem("userToken", result.token);
      localStorage.setItem("userRole", "user");

      // Close modal and navigate to dashboard
      setShowModal(false);
      const redirectPath = localStorage.getItem("postLoginRedirect");
      if (redirectPath) {
        localStorage.removeItem("postLoginRedirect");
        navigate(redirectPath);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Login failed. Please try again.");
      setShowModal(false);
    }
  };

  useEffect(() => {
    // Dynamically load the Google Identity Services script if not already present
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
    // Redirect to backend OAuth endpoint for Google login with Drive access
    const apiBase = import.meta.env.VITE_API_URL || "";
    const intendedRedirect =
      localStorage.getItem("postLoginRedirect") || "/dashboard";
    window.location.href = `${apiBase}/api/auth/google/user?redirect=${encodeURIComponent(
      intendedRedirect
    )}`;
  };

  return (
    <>
      <Navbar />
      <div
        className="student-login-main"
        style={{
          minHeight: "85vh",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2
          className="student-login-heading"
          style={{ marginBottom: 70, fontSize: 50, textAlign: "center" }}
        >
          Student Login
        </h2>
        <div
          className="student-login-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
          }}
        >
          <p style={{ fontSize: 18, textAlign: "center", maxWidth: 400 }}>
            Sign in with your Google account to access your student dashboard
          </p>
          <button
            className="student-login-btn"
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "32px 48px",
              fontSize: 18,
              cursor: "pointer",
            }}
            onClick={handleStudentLogin}
          >
            Sign in with Google
          </button>
        </div>
      </div>
      <style>{`
        .student-login-main {
          padding: 0 24px;
        }
        .student-login-heading {
          font-size: 70px;
        }
        .student-login-btn {
          background: #000;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 32px 48px;
          font-size: 18px;
          cursor: pointer;
          margin-bottom: 0;
          transition: background 0.2s, color 0.2s;
        }
        .student-login-btn:hover {
          background: #333;
        }
        @media (max-width: 700px) {
          .student-login-heading {
            font-size: 36px;
            margin-bottom: 48px;
          }
          .student-login-content {
            width: 100%;
            max-width: 350px;
          }
          .student-login-btn {
            width: 100%;
            padding: 18px 0;
            font-size: 16px;
            margin-bottom: 0;
          }
        }
        @media (max-width: 400px) {
          .student-login-heading {
            font-size: 24px;
          }
          .student-login-btn {
            font-size: 14px;
            padding: 12px 0;
          }
        }
      `}</style>
    </>
  );
}

export default StudentLogin;
