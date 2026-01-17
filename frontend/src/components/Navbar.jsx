import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

// Sun Icon SVG
const SunIcon = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

// Moon Icon SVG
const MoonIcon = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Logo = ({ theme, onClick }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <button
      onClick={onClick}
      className="navbar-logo"
      style={{
        fontWeight: 800,
        fontSize: 24,
        color: theme.primary,
        fontFamily: "Raleway, sans-serif",
        fontStyle: "normal",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1)" : "scale(0.9)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        userSelect: "none",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Pingnotes
    </button>
  );
};

function isLoggedIn() {
  return !!(
    localStorage.getItem("userToken") || localStorage.getItem("adminToken")
  );
}

const Navbar = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleNavClick = () => setMenuOpen(false);

  const handleLoginClick = () => {
    setMenuOpen(false);
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate("/login");
    }
  };

  // Close menu if route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          width: "calc(100% - 32px)",
          maxWidth: "1200px",
          background: theme.navBg,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${theme.navBorder}`,
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          fontFamily: "Poppins, Arial, sans-serif",
        }}
        role="navigation"
        aria-label="Primary"
      >
        <div className="navbar-container" style={{ gap: 16 }}>
          <Logo theme={theme} onClick={() => navigate("/")} />
          <button
            className={`navbar-hamburger${menuOpen ? " open" : ""}`}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={handleMenuToggle}
            style={{ color: theme.text }}
          >
            <span className="hamburger-bar bar1" />
            <span className="hamburger-bar bar2" />
            <span className="hamburger-bar bar3" />
          </button>
          <div
            className={`navbar-links${menuOpen ? " open" : ""}`}
            onClick={handleNavClick}
            style={{
              color: theme.text,
              background: menuOpen ? theme.navBg : "transparent",
            }}
          >
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/features"
              className={location.pathname === "/features" ? "active" : ""}
            >
              Features
            </Link>
            <Link
              to="/plans"
              className={location.pathname === "/plans" ? "active" : ""}
            >
              Plans
            </Link>
            <Link
              to="/faq"
              className={location.pathname === "/faq" ? "active" : ""}
            >
              FAQs
            </Link>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              About
            </Link>
          </div>

          {/* Mobile buttons - visible on mobile navbar */}
          <div className="navbar-btn-mobile-bar">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: `2px solid ${theme.primary}`,
                borderRadius: 8,
                padding: "6px 10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                color: theme.primary,
              }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <SunIcon color={theme.primary} />
              ) : (
                <MoonIcon color={theme.primary} />
              )}
            </button>

            <button
              className="navbar-btn navbar-btn-mobile-visible"
              onClick={() =>
                loggedIn ? navigate("/dashboard") : handleLoginClick()
              }
              type="button"
              style={{
                background: theme.primary,
                color: isDark ? "#000" : "#fff",
                padding: "8px 16px",
                fontSize: "14px",
              }}
            >
              {loggedIn ? "Dashboard" : "Login"}
            </button>
          </div>

          {/* Desktop button */}
          <div
            className="navbar-btn-desktop"
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: "none",
                border: `2px solid ${theme.primary}`,
                borderRadius: 10,
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                color: theme.primary,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.hover;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "none";
              }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <SunIcon color={theme.primary} />
              ) : (
                <MoonIcon color={theme.primary} />
              )}
            </button>

            {loggedIn ? (
              <button
                className="navbar-btn"
                onClick={() => navigate("/dashboard")}
                type="button"
                style={{
                  background: theme.primary,
                  color: isDark ? "#000" : "#fff",
                }}
              >
                Dashboard
              </button>
            ) : (
              <button
                className="navbar-btn"
                onClick={handleLoginClick}
                type="button"
                style={{
                  background: theme.primary,
                  color: isDark ? "#000" : "#fff",
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* CSS Styling */}
      <style>{`
        .navbar-container {
          justify-content: space-between;
          display: flex;
          align-items: center;
          padding: 12px 24px;
          position: relative;
          user-select: none;
        }
        .navbar-btn-mobile-bar {
          display: none;
        }
        .navbar-links {
          display: flex;
          gap: 32px;
          align-items: center;
          position: static;
          background: none;
          flex-direction: row;
          padding: 0;
          box-shadow: none;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .navbar-links a {
          text-decoration: none;
          font-weight: 600;
          font-size: 17px;
          font-family: Poppins, Arial, sans-serif;
          color: inherit;
          transition:
            color 0.2s,
            border-bottom-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 3px solid transparent;
          padding-bottom: 4px;
          user-select: text;
        }
        .navbar-links a:hover,
        .navbar-links a:focus {
          outline: none;
          color: #00d4ff;
        }
        .navbar-links a.active {
          font-weight: 700;
          color: #00d4ff;
        }
        .navbar-btn {
          color: #fff;
          padding: 10px 24px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 16px;
          font-family: Poppins, Arial, sans-serif;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,120,255,0.08);
          border: none;
          cursor: pointer;
          transition:
            background 0.3s cubic-bezier(0.4,0,0.2,1),
            transform 0.2s ease,
            box-shadow 0.3s ease;
          margin-left: 16px;
          user-select: none;
        }
        .navbar-btn:hover,
        .navbar-btn:focus-visible {
          background: #0056b3;
          transform: scale(1.07);
          box-shadow: 0 4px 16px rgba(0,100,255,0.3);
          outline-offset: 3px;
        }

        /* Hamburger button and bars */
        .navbar-hamburger {
          display: none;
          position: relative;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-left: 16px;
          transition: transform 0.25s ease;
          z-index: 1100;
        }
        .hamburger-bar {
          width: 28px;
          height: 3px;
          background: currentColor;
          margin: 4px 0;
          border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          transform-origin: center;
        }

        /* Animate hamburger to X */
        .navbar-hamburger.open .bar1 {
          transform: rotate(45deg) translate(6px, 6px);
        }
        .navbar-hamburger.open .bar2 {
          opacity: 0;
        }
        .navbar-hamburger.open .bar3 {
          transform: rotate(-45deg) translate(6px, -6px);
        }
        
        @media (max-width: 900px) {
          .navbar-container {
            padding: 16px 16px 8px 16px;
          }
          .navbar-links {
            gap: 18px;
          }
        }

        @media (max-width: 768px) {
          .navbar-hamburger {
            display: flex;
          }
          .navbar-btn-desktop {
            display: none !important;
          }
          .navbar-btn-mobile-bar {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .navbar-links {
            position: absolute;
            top: 100%;
            right: 0;
            left: 0;
            background: inherit;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            padding: 0 0 12px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            transition:
              max-height 0.4s cubic-bezier(0.4,0,0.2,1),
              opacity 0.35s ease,
              padding 0.35s ease;
            z-index: 1001;
          }
          .navbar-links.open {
            max-height: 450px; /* big enough to show all links + button */
            opacity: 1;
            padding: 16px 0 12px 0;
            pointer-events: auto;
          }
          .navbar-links a {
            width: 100%;
            padding: 14px 32px;
            font-size: 18px;
            border-radius: 0;
            margin: 0;
            text-align: left;
            border-bottom: 1px solid #f0f0f0;
            box-sizing: border-box;
            opacity: 0;
            transform: translateX(-15px);
            animation-fill-mode: forwards;
            animation-duration: 0.28s;
            animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            /* Animation delay staggering */
          }
          /* Stagger the menu items appearing */
          .navbar-links.open a:nth-child(1) {
            animation-name: slideFadeIn;
            animation-delay: 0s;
          }
          .navbar-links.open a:nth-child(2) {
            animation-name: slideFadeIn;
            animation-delay: 0.03s;
          }
          .navbar-links.open a:nth-child(3) {
            animation-name: slideFadeIn;
            animation-delay: 0.06s;
          }
          .navbar-links.open a:nth-child(4) {
            animation-name: slideFadeIn;
            animation-delay: 0.09s;
          }
          .navbar-links.open a:nth-child(5) {
            animation-name: slideFadeIn;
            animation-delay: 0.12s;
          }

          @keyframes slideFadeIn {
            from {
              opacity: 0;
              transform: translateX(-15px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .navbar-btn-desktop {
            display: none;
          }
        }
        @media (min-width: 769px) {
          .navbar-btn-mobile {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .navbar-container {
            padding: 10px 12px 6px 12px;
            justify-content: flex-end;
          }
          .navbar-logo {
            display: none !important;
          }
          .navbar-hamburger {
            margin-left: 0;
            margin-right: auto;
          }
          .navbar-links a, .navbar-btn {
            font-size: 16px;
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
