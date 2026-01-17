import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import LoginModal from "./LoginModal";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

// Sparkle component
const Sparkle = ({ delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
    transition={{ duration: 1, repeat: Infinity, delay }}
    style={{
      position: "absolute",
      width: 6,
      height: 6,
      background: "white",
      borderRadius: "50%",
      pointerEvents: "none",
    }}
  />
);

const Home = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          background: theme.bg,
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          paddingTop: "80px",
        }}
      >
        <Navbar onLoginClick={() => setShowLoginModal(true)} />
        {/* Hero */}
        <section
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "60px 20px",
            boxSizing: "border-box",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: "clamp(80px, 18vw, 140px)",
              fontWeight: 800,
              letterSpacing: 4,
              marginBottom: 60,
              lineHeight: 1.5,
              position: "relative",
              marginTop: "40px",
              paddingBottom: "20px",
            }}
          >
            {/* Background text with color animation */}
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #0078FF, #00D4FF, #0078FF)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
                position: "relative",
                paddingRight: "20px",
              }}
            >
              Pingnotes
              {/* Sparkles */}
              <Sparkle delay={0} />
              <Sparkle delay={0.2} />
              <Sparkle delay={0.4} />
              <Sparkle delay={0.6} />
              <Sparkle delay={0.8} />
              <motion.div
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "15%",
                  width: 8,
                  height: 8,
                }}
              >
                <Sparkle delay={0.1} />
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  top: "60%",
                  right: "20%",
                  width: 8,
                  height: 8,
                }}
              >
                <Sparkle delay={0.3} />
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "25%",
                  width: 8,
                  height: 8,
                }}
              >
                <Sparkle delay={0.5} />
              </motion.div>
              <motion.div
                style={{
                  position: "absolute",
                  top: "15%",
                  right: "30%",
                  width: 8,
                  height: 8,
                }}
              >
                <Sparkle delay={0.7} />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              fontSize: "clamp(20px, 5vw, 30px)",
              fontWeight: 700,
              color: theme.text,
              margin: "32px 0 0 0",
              lineHeight: 1.1,
            }}
          >
            Notes Organisation{" "}
            <span style={{ color: theme.primary }}>Simplified</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            style={{
              fontSize: "clamp(16px, 3vw, 18px)",
              color: theme.textSecondary,
              margin: "32px auto 0 auto",
              maxWidth: 700,
              fontWeight: 400,
              padding: "0 15px",
              lineHeight: 1.6,
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
                background: theme.primary,
                color: isDark ? "#000" : "#fff",
                padding: "16px 48px",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "clamp(18px, 4vw, 22px)",
                textDecoration: "none",
                boxShadow: `0 4px 16px ${isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 120, 255, 0.1)"}`,
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
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  background: "#0a192f",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
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
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          // Optional: handle post-login navigation if needed
        }}
      />
    </>
  );
};

export default Home;
