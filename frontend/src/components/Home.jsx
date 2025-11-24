import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import pnLogo from "../assets/pn_logo.png";
import Navbar from "./Navbar";

const Home = () => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          background:
            "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 25%, #90caf9 50%, #64b5f6 75%, #42a5f5 100%)",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowX: "hidden",   // 🟦 CHANGED: Only hide horizontal overflow
          overflowY: "visible",  // 🟦 CHANGED: Allow page scroll
        }}
      >
        {/* 🟦 CHANGED: Make backgrounds absolute instead of fixed 
              so they don't block scrolling */}
        <div
          style={{
            position: "absolute",   // 🟦 CHANGED
            top: 0,
            left: 0,
            right: 0,
            height: "200vh",        // 🟦 CHANGED: extend bg for scroll
            background: `
              radial-gradient(circle at 20% 80%, rgba(33, 150, 243, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(25, 118, 210, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(21, 101, 192, 0.1) 0%, transparent 50%)
            `,
            animation: "float 20s ease-in-out infinite",
            zIndex: -1,
          }}
        />

        <div
          style={{
            position: "absolute",   // 🟦 CHANGED
            top: 0,
            left: 0,
            right: 0,
            height: "200vh",        // 🟦 CHANGED: extend shimmer for scroll
            background:
              "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
            animation: "shimmer 8s ease-in-out infinite",
            zIndex: -1,
          }}
        />

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-20px) rotate(1deg); }
              66% { transform: translateY(10px) rotate(-1deg); }
            }
            @keyframes shimmer {
              0%, 100% { opacity: 0.3; transform: translateX(-100%); }
              50% { opacity: 0.6; transform: translateX(100%); }
            }
          `}
        </style>

        <Navbar />

        {showBanner && (
          <div
            style={{
              background: "linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)",
              color: "#fff",
              padding: "8px 0",
              textAlign: "center",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            🚀 Welcome!
          </div>
        )}

        {/* HERO SECTION */}
        <section
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
            boxSizing: "border-box",
            position: "relative",
            zIndex: 10,
          }}
        >
          <motion.img
            src={pnLogo}
            alt="PingNotes Logo"
            style={{
              width: "clamp(120px, 25vw, 200px)",
              height: "clamp(120px, 25vw, 200px)",
              filter: "drop-shadow(0 0 32px #0078FF55)",
              marginTop: "20px",
            }}
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          />

          {/* The rest of your sections remain EXACTLY same */}
          {/* Features, How it works, CTA… */}
        </section>
      </div>
    </>
  );
};

export default Home;
