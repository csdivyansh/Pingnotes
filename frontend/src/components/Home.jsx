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
              fontSize: "clamp(48px, 12vw, 140px)",
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 40,
              lineHeight: 1.3,
              position: "relative",
              marginTop: "20px",
              paddingBottom: "10px",
              width: "100%",
              maxWidth: "100%",
              overflow: "visible",
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
                padding: "0 10px",
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
                  background: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
                  border: `1px solid ${
                    isDark
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 120, 255, 0.1)"
                  }`,
                  borderRadius: 14,
                  padding: 20,
                  boxShadow: isDark
                    ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : "0 2px 10px rgba(0, 120, 255, 0.04)",
                  textAlign: "left",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onHoverStart={(e) => {
                  e.currentTarget.style.borderColor = theme.primary;
                  e.currentTarget.style.boxShadow = isDark
                    ? `0 4px 20px ${theme.primary}20`
                    : `0 4px 20px ${theme.primary}15`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onHoverEnd={(e) => {
                  e.currentTarget.style.borderColor = isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 120, 255, 0.1)";
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : "0 2px 10px rgba(0, 120, 255, 0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: theme.text,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    color: theme.textMuted,
                    marginTop: 8,
                    fontSize: 15,
                    lineHeight: 1.5,
                  }}
                >
                  {f.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "32px 20px 32px 20px",
          }}
        >
          <div
            style={{ margin: "0 auto", maxWidth: 1100, textAlign: "center" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              style={{
                fontWeight: 800,
                fontSize: 28,
                color: theme.text,
                marginBottom: 28,
              }}
            >
              How it works
            </motion.div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
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
              ].map((s, idx) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    background: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "#ffffff",
                    border: `1px solid ${
                      isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 120, 255, 0.1)"
                    }`,
                    borderRadius: 14,
                    padding: 20,
                    boxShadow: isDark
                      ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                      : "0 2px 10px rgba(0, 120, 255, 0.04)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: isDark
                        ? `${theme.primary}20`
                        : `${theme.primary}15`,
                      color: theme.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 20,
                    }}
                  >
                    {s.step}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      marginTop: 14,
                      color: theme.text,
                      fontSize: 18,
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      color: theme.textMuted,
                      marginTop: 8,
                      fontSize: 15,
                      lineHeight: 1.5,
                    }}
                  >
                    {s.desc}
                  </div>
                </motion.div>
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
              background: isDark
                ? "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 120, 255, 0.1) 100%)"
                : "linear-gradient(135deg, #0078FF 0%, #00B1FF 100%)",
              borderRadius: 16,
              padding: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              color: isDark ? theme.text : "#fff",
              border: isDark ? `1px solid ${theme.primary}40` : "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              style={{
                fontWeight: 800,
                fontSize: 26,
              }}
            >
              Ready to get organised?
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                opacity: isDark ? 0.8 : 0.9,
                marginTop: 8,
                fontSize: 16,
              }}
            >
              Start free. Upgrade anytime.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: "flex",
                gap: 12,
                marginTop: 18,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  background: isDark ? "rgba(255, 255, 255, 0.1)" : "#0a192f",
                  color: isDark ? theme.primary : "#fff",
                  padding: "12px 28px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  border: isDark ? `1px solid ${theme.primary}40` : "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: 15,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = isDark
                    ? `rgba(255, 255, 255, 0.15)`
                    : "#1a2744";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = isDark
                    ? "rgba(255, 255, 255, 0.1)"
                    : "#0a192f";
                }}
              >
                Sign In
              </button>
              <Link
                to="/explore"
                style={{
                  background: isDark ? theme.primary : "#ffffff",
                  color: isDark ? "#000" : "#0a192f",
                  padding: "12px 28px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                  fontSize: 15,
                }}
                onMouseEnter={(e) => {
                  e.style.opacity = "0.9";
                  e.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.style.opacity = "1";
                  e.style.transform = "translateY(0)";
                }}
              >
                Explore
              </Link>
            </motion.div>
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
