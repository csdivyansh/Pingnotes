import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";
import apiService from "../services/api.js";

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

const Logo = ({ theme }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div
      className="dashnav-logo"
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
      }}
    >
      Pingnotes
    </div>
  );
};

const DashNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? themes.dark : themes.light;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleNavClick = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
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
        aria-label="Dashboard"
      >
        <div className="dashnav-container" style={{ gap: 16 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Logo theme={theme} />
          </Link>
          <button
            className={`dashnav-hamburger${menuOpen ? " open" : ""}`}
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
            className={`dashnav-links${menuOpen ? " open" : ""}`}
            onClick={handleNavClick}
            style={{
              color: theme.text,
              background: menuOpen ? theme.navBg : "transparent",
            }}
          >
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              Subjects
            </Link>
            <Link
              to="/dashboard/files"
              className={
                location.pathname === "/dashboard/files" ? "active" : ""
              }
            >
              Notes
            </Link>
            <Link
              to="/dashboard/groups"
              className={
                location.pathname === "/dashboard/groups" ? "active" : ""
              }
            >
              Groups
            </Link>
            <Link
              to="/dashboard/trash"
              className={
                location.pathname === "/dashboard/trash" ? "active" : ""
              }
            >
              Trash
            </Link>
            {/* Mobile Logout Button */}
            <button
              className="dashnav-btn dashnav-btn-mobile dashnav-btn-logout"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>

          {/* Mobile buttons - visible on mobile navbar */}
          <div className="dashnav-btn-mobile-bar">
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

            {/* Desktop Logout Button */}
            <button
              className="dashnav-btn dashnav-btn-mobile-visible dashnav-btn-logout"
              onClick={handleLogout}
              type="button"
              style={{
                padding: "8px 16px",
                fontSize: "14px",
              }}
            >
              Logout
            </button>
          </div>

          {/* Desktop buttons */}
          <div
            className="dashnav-btn-desktop"
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

            {/* Desktop Logout Button */}
            <button
              className="dashnav-btn dashnav-btn-desktop dashnav-btn-logout"
              onClick={handleLogout}
              type="button"
              style={{
                background: "#dc3545",
                color: "#fff",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <style>{`
        .dashnav-container {
          justify-content: space-between;
          display: flex;
          align-items: center;
          padding: 12px 24px;
          position: relative;
          user-select: none;
          gap: 16px;
        }
        .dashnav-btn-mobile-bar {
          display: none;
        }
        .dashnav-links {
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
        .dashnav-links a {
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
        .dashnav-links a:hover,
        .dashnav-links a:focus {
          outline: none;
          color: #00d4ff;
        }
        .dashnav-links a.active {
          font-weight: 700;
          color: #00d4ff;
        }
        .dashnav-btn {
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
          margin-left: 0;
          user-select: none;
        }
        .dashnav-btn:hover,
        .dashnav-btn:focus-visible {
          transform: scale(1.07);
          box-shadow: 0 4px 16px rgba(0,100,255,0.3);
          outline-offset: 3px;
        }
        .dashnav-btn-logout {
          background: #dc3545;
          box-shadow: 0 2px 8px rgba(220,53,69,0.08);
        }
        .dashnav-btn-logout:hover {
          background: #c82333;
        }

        /* Hamburger button and bars */
        .dashnav-hamburger {
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
        .dashnav-hamburger.open .bar1 {
          transform: rotate(45deg) translate(6px, 6px);
        }
        .dashnav-hamburger.open .bar2 {
          opacity: 0;
        }
        .dashnav-hamburger.open .bar3 {
          transform: rotate(-45deg) translate(6px, -6px);
        }
        
        @media (max-width: 900px) {
          .dashnav-container {
            padding: 16px 16px 8px 16px;
          }
          .dashnav-links {
            gap: 18px;
          }
        }

        @media (max-width: 768px) {
          .dashnav-hamburger {
            display: flex;
          }
          .dashnav-btn-desktop {
            display: none !important;
          }
          .dashnav-btn-mobile-bar {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .dashnav-links {
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
          .dashnav-links.open {
            max-height: 450px;
            opacity: 1;
            padding: 16px 0 12px 0;
            pointer-events: auto;
          }
          .dashnav-links a {
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
          }
          /* Stagger the menu items appearing */
          .dashnav-links.open a:nth-child(1) {
            animation-name: slideFadeIn;
            animation-delay: 0s;
          }
          .dashnav-links.open a:nth-child(2) {
            animation-name: slideFadeIn;
            animation-delay: 0.03s;
          }
          .dashnav-links.open a:nth-child(3) {
            animation-name: slideFadeIn;
            animation-delay: 0.06s;
          }
          .dashnav-links.open a:nth-child(4) {
            animation-name: slideFadeIn;
            animation-delay: 0.09s;
          }
          .dashnav-links.open a:nth-child(5) {
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

          .dashnav-btn-desktop {
            display: none;
          }
        }
        @media (min-width: 769px) {
          .dashnav-btn-mobile {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .dashnav-container {
            padding: 10px 12px 6px 12px;
            justify-content: flex-end;
          }
          .dashnav-logo {
            display: none !important;
          }
          .dashnav-hamburger {
            margin-left: 0;
            margin-right: auto;
          }
          .dashnav-links a, .dashnav-btn {
            font-size: 16px;
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default DashNav;
