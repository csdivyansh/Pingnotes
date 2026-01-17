/*StudentLogin.jsx file */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

function StudentLogin() {
  const navigate = useNavigate();

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

  return (
    <LoginModal
      isOpen={true}
      onClose={() => navigate("/")}
      onLoginSuccess={() => {
        const redirectPath = localStorage.getItem("postLoginRedirect");
        if (redirectPath) {
          localStorage.removeItem("postLoginRedirect");
          navigate(redirectPath);
        } else {
          navigate("/dashboard");
        }
      }}
    />
  );
}

export default StudentLogin;
