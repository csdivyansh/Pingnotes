import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const googleButtonRef = useRef(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  const handleCredentialResponse = async (response) => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const result = await fetch(`${apiBase}/api/auth/google/onetap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
          role: "student",
        }),
      });

      const data = await result.json();

      if (result.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", "user");
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        console.error("Login failed:", data.message);
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  // Fallback to redirect login
  const handleFallbackLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || "";
    const intendedRedirect =
      localStorage.getItem("postLoginRedirect") || "/dashboard";
    window.location.href = `${apiBase}/api/auth/google/user?redirect=${encodeURIComponent(
      intendedRedirect
    )}`;
  };

  useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setGoogleLoaded(true);
          initializeGoogle();
        };
        document.body.appendChild(script);
      } else {
        setGoogleLoaded(true);
        initializeGoogle();
      }
    };
    loadGoogleScript();
  }, []);

  const initializeGoogle = () => {
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  };

  useEffect(() => {
    if (
      isOpen &&
      googleButtonRef.current &&
      window.google &&
      GOOGLE_CLIENT_ID
    ) {
      // Clear previous button
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: isDark ? "filled_black" : "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 280,
      });
    }
  }, [isOpen, googleLoaded, isDark]);

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
          background: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: isDark
              ? "rgba(30, 30, 30, 0.85)"
              : "rgba(255, 255, 255, 0.9)",
            borderRadius: 20,
            padding: "48px 40px",
            maxWidth: 420,
            width: "90%",
            boxShadow: isDark
              ? "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
              : "0 20px 60px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "slideIn 0.3s ease-out",
            position: "relative",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.05)",
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
              fontSize: 20,
              cursor: "pointer",
              color: isDark ? "#999" : "#666",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = isDark
                ? "rgba(255,255,255,0.1)"
                : "#f0f0f0";
              e.target.style.color = isDark ? "#fff" : "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
              e.target.style.color = isDark ? "#999" : "#666";
            }}
          >
            ✕
          </button>

          <h2
            style={{
              fontSize: 26,
              fontWeight: 600,
              marginBottom: 12,
              color: isDark ? "#fff" : "#0a192f",
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Log in or sign up
          </h2>

          <p
            style={{
              fontSize: 14,
              color: isDark ? "rgba(255,255,255,0.6)" : "#666",
              textAlign: "center",
              marginBottom: 32,
              maxWidth: 320,
              lineHeight: 1.5,
            }}
          >
            Access your notes, files, and more with your Google account
          </p>

          {/* Google One Tap Button */}
          <div
            ref={googleButtonRef}
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              minHeight: 44,
            }}
          ></div>

          {/* Fallback button if Google doesn't load */}
          {(!googleLoaded || !GOOGLE_CLIENT_ID) && (
            <button
              onClick={handleFallbackLogin}
              style={{
                background: isDark ? "#fff" : "#fff",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "12px 24px",
                fontSize: 15,
                cursor: "pointer",
                width: "100%",
                maxWidth: 280,
                fontWeight: 500,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f7f7f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-30px);
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
