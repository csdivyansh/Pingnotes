/*AuthSuccess.jsx*/
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token && role) {
      // Store the new token (this will have Google Drive access)
      localStorage.setItem("userToken", token);
      localStorage.setItem("userRole", role);

      // Always redirect to /plans after login
      navigate("/plans");
    } else {
      // If no token, redirect to home
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h2>Authorizing Google Drive...</h2>
      <p>Please wait while we complete the authorization.</p>
    </div>
  );
};

export default AuthSuccess;
