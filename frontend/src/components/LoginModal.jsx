import React from "react";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
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
            position: "relative",
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
              fontWeight: 600,
              marginBottom: 12,
              color: "#0a192f",
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Log in or sign up
          </h2>

          <p
            style={{
              fontSize: 15,
              color: "#666",
              textAlign: "center",
              marginBottom: 32,
              maxWidth: 400,
            }}
          >
            Access your notes, files, and more with your Google account
          </p>

          <button
            style={{
              background: "#fff",
              color: "#333",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "14px 24px",
              fontSize: 16,
              cursor: "pointer",
              width: "100%",
              fontWeight: 500,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f7f7f7";
              e.currentTarget.style.borderColor = "#ccc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#ddd";
            }}
            onClick={handleStudentLogin}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
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
