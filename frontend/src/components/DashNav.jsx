  import React, { useRef, useState } from "react";
  import { useNavigate, Link, useLocation } from "react-router-dom";
  import { useGlobalFileUpload } from "./GlobalFileUploadContext";
  import apiService from "../services/api.js";

  const Logo = () => (
    <div>
      <span
        style={{
          fontWeight: 800,
          fontSize: 24,
          color: "#0a192f",
          fontFamily: "Raleway, sans-serif",
          fontStyle: "normal",
        }}
      >
        Pingnotes
      </span>
    </div>
  );

  const DashNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const { openUploadModal } = useGlobalFileUpload();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => setMenuOpen((open) => !open);
    const handleNavClick = () => setMenuOpen(false);

    const handleUploadClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Placeholder: handle file upload logic here
        alert(`Selected file: ${file.name}`);
      }
    };

    const handleHomeClick = () => {
      navigate("/");
    };

    const handleLogout = async () => {
      try {
        // Clear authentication tokens and call backend
        await apiService.logout();
        // Redirect to home page
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
        // Even if there's an error, redirect to home
        navigate("/");
      }
    };

    return (
      <>
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            width: "100%",
            fontFamily: "Poppins, Arial, sans-serif",
          }}
        >
          <div className="dashnav-container">
            <Link to="/" style={{ textDecoration: "none" }}>
              <Logo />
            </Link>
            <button
              className="dashnav-hamburger"
              aria-label="Toggle navigation menu"
              onClick={handleMenuToggle}
            >
              Groups
            </Link>
            <Link
              to="/dashboard/trash"
              className={
                location.pathname === "/dashboard/trash" ? "active" : ""
              }
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
                ToDos
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
            {/* Desktop Logout Button */}
            <button
              className="dashnav-btn dashnav-btn-desktop dashnav-btn-logout"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </nav>
        <div style={{ height: 72 }} />
        <style>{`
          .dashnav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 32px 12px 32px;
            position: relative;
          }
          .dashnav-links {
            display: flex;
            gap: 32px;
            align-items: center;
          }
          .dashnav-links a {
            color: #0a192f;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            font-family: Poppins, Arial, sans-serif;
            letter-spacing: 0.5px;
            transition: color 0.2s;
          }
          .dashnav-links a.active {
            color: #0078FF;
          }
          .dashnav-btn {
            background: #0078FF;
            color: #fff;
            padding: 10px 28px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 16px;
            font-family: Poppins, Arial, sans-serif;
            text-decoration: none;
            box-shadow: 0 2px 8px rgba(0,120,255,0.08);
            border: none;
            cursor: pointer;
            letter-spacing: 0.5px;
            transition: background 0.2s;
            margin-left: 16px;
          }
          .dashnav-btn-logout {
            background: #dc3545;
            box-shadow: 0 2px 8px rgba(220,53,69,0.08);
          }
          .dashnav-btn-logout:hover {
            background: #c82333;
          }
          .dashnav-hamburger {
            display: none;
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
          }
          .hamburger-bar {
            width: 28px;
            height: 3px;
            background: #0a192f;
            margin: 4px 0;
            border-radius: 2px;
            transition: all 0.3s;
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
            .dashnav-links {
              position: absolute;
              top: 100%;
              right: 0;
              left: 0;
              background: #fff;
              flex-direction: column;
              align-items: flex-start;
              gap: 0;
              padding: 0 0 12px 0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
              display: none;
              z-index: 1001;
            }
            .dashnav-links.open {
              display: flex;
            }
            .dashnav-links a, .dashnav-btn {
              width: 100%;
              padding: 14px 24px;
              font-size: 18px;
              border-radius: 0;
              margin: 0;
              text-align: left;
            }
            .dashnav-btn-desktop {
              display: none;
            }
            .dashnav-btn-mobile {
              display: block;
            }
          }
          @media (min-width: 769px) {
            .dashnav-btn-mobile {
              display: none !important;
            }
          }
          @media (max-width: 480px) {
            .dashnav-container {
              padding: 10px 4vw 6px 4vw;
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
