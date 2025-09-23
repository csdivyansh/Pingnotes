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
          background: "linear-gradient(180deg, #f9fbfd 0%, #f6f9ff 100%)",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
        {/* Hero */}
        <section
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "20px",
            boxSizing: "border-box",
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: "clamp(40px, 10vw, 72px)",
              fontWeight: 800,
              color: "#0078FF",
              letterSpacing: 2,
              marginBottom: 0,
              lineHeight: 1.1,
            }}
          >
            Ping<span style={{ color: "#0a192f" }}>notes</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              fontSize: "clamp(20px, 5vw, 30px)",
              fontWeight: 700,
              color: "#0a192f",
              margin: "12px 0 0 0",
              lineHeight: 1.1,
            }}
          >
            Notes Organisation{" "}
            <span style={{ color: "#0078FF" }}>Simplified</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{
              fontSize: "clamp(16px, 3vw, 18px)",
              color: "#222",
              margin: "20px auto 0 auto",
              maxWidth: 700,
              fontWeight: 400,
              padding: "0 15px",
            }}
          >
            Organise, search, and access your notes with ease. Pingnotes helps
            you keep your study and work materials structured, accessible, and
            always at your fingertips.
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ display: "inline-block" }}
          >
            <Link
              to="/plans"
              style={{
                display: "inline-block",
                marginTop: 30,
                background: "#0078FF",
                color: "#fff",
                padding: "16px 48px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "clamp(18px, 4vw, 22px)",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(0,120,255,0.10)",
              }}
            >
              Get Started{" "}
              <span
                style={{ fontSize: "clamp(20px, 5vw, 26px)", marginLeft: 8 }}
              >
                →
              </span>
            </Link>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "24px 20px 8px 20px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: 1100,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                title: "Smart organisation",
                desc: "Tag, group, and structure notes effortlessly.",
                icon: "🗂️",
              },
              {
                title: "Powerful search",
                desc: "Find anything instantly with rich filters.",
                icon: "🔎",
              },
              {
                title: "File support",
                desc: "PDFs, images, and more in one place.",
                icon: "📄",
              },
              {
                title: "Cloud sync",
                desc: "Your notes everywhere you are.",
                icon: "☁️",
              },
            ].map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                style={{
                  background: "#ffffff",
                  border: "1px solid #e9eef5",
                  borderRadius: 14,
                  padding: 18,
                  boxShadow: "0 2px 10px rgba(14,30,62,0.04)",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: 28 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>
                  {f.title}
                </div>
                <div style={{ color: "#334155", marginTop: 6 }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px 20px 32px 20px",
          }}
        >
          <div
            style={{ margin: "0 auto", maxWidth: 1100, textAlign: "center" }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: 24,
                color: "#0a192f",
                marginBottom: 14,
              }}
            >
              How it works
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                textAlign: "left",
              }}
            >
              {[
                {
                  step: "1",
                  title: "Upload",
                  desc: "Add files or paste notes directly.",
                },
                {
                  step: "2",
                  title: "Organise",
                  desc: "Create groups and apply tags.",
                },
                {
                  step: "3",
                  title: "Search",
                  desc: "Use filters to find what matters.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e9eef5",
                    borderRadius: 14,
                    padding: 18,
                    boxShadow: "0 2px 10px rgba(14,30,62,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#e8f2ff",
                      color: "#0a63d1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {s.step}
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 10 }}>
                    {s.title}
                  </div>
                  <div style={{ color: "#334155", marginTop: 6 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA strip */}
        <section
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "16px 20px 28px 20px",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              maxWidth: 1100,
              background: "linear-gradient(90deg, #0078FF 0%, #00B1FF 100%)",
              borderRadius: 16,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 22 }}>
              Ready to get organised?
            </div>
            <div style={{ opacity: 0.9, marginTop: 6 }}>
              Start free. Upgrade anytime.
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/login"
                style={{
                  background: "#0a192f",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Sign In
              </Link>
              <Link
                to="/explore"
                style={{
                  background: "#ffffff",
                  color: "#0a192f",
                  padding: "12px 20px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Explore
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
