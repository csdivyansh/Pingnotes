import React from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCloudUploadAlt,
  FaUsers,
  FaFolderOpen,
  FaBell,
  FaLock,
  FaFileAlt,
  FaStar,
  FaBrain,
  FaLaptopCode,
} from "react-icons/fa";
import Navbar from "./Navbar";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

interface Feature {
  title: string;
  icon: React.ReactNode;
  description: string;
  color?: string;
}

const featuresData: Feature[] = [
  {
    title: "Organised Structure",
    icon: <FaFolderOpen size={28} />,
    description:
      "Easily group notes by subjects, tags, or categories to stay organised.",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Quick Search",
    icon: <FaSearch size={28} />,
    description: "Find notes instantly with easy search and filters.",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Collaborative Sharing",
    icon: <FaUsers size={28} />,
    description: "Share notes securely with classmates or teachers.",
    color: "from-pink-500 to-pink-600",
  },
  {
    title: "Cloud Backup",
    icon: <FaCloudUploadAlt size={28} />,
    description: "Access your notes from anywhere with automatic backups.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    title: "Smart Notifications",
    icon: <FaBell size={28} />,
    description:
      "Stay updated with real-time alerts on shared and updated notes.",
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Secure & Private",
    icon: <FaLock size={28} />,
    description:
      "Your notes are encrypted and only visible to authorized users.",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Rich File Support",
    icon: <FaFileAlt size={28} />,
    description: "Upload PDFs, Docs, and images along with text notes.",
    color: "from-red-500 to-red-600",
  },
  {
    title: "Pinned & Starred Notes",
    icon: <FaStar size={28} />,
    description: "Mark important notes so they're always at your fingertips.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    title: "AI-Powered Summaries",
    icon: <FaBrain size={28} />,
    description: "Summarise long notes instantly using advanced AI.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Smart Suggestions",
    icon: <FaLaptopCode size={28} />,
    description: "Get automatic tag suggestions and topic links while writing.",
    color: "from-teal-500 to-teal-600",
  },
];

const Features: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  const colorMap: { [key: string]: string } = {
    "from-blue-500": isDark ? "rgb(59, 130, 246)" : "rgb(59, 130, 246)",
    "from-purple-500": isDark ? "rgb(168, 85, 247)" : "rgb(168, 85, 247)",
    "from-pink-500": isDark ? "rgb(236, 72, 153)" : "rgb(236, 72, 153)",
    "from-cyan-500": isDark ? "rgb(34, 211, 238)" : "rgb(34, 211, 238)",
    "from-orange-500": isDark ? "rgb(249, 115, 22)" : "rgb(249, 115, 22)",
    "from-green-500": isDark ? "rgb(34, 197, 94)" : "rgb(34, 197, 94)",
    "from-red-500": isDark ? "rgb(239, 68, 68)" : "rgb(239, 68, 68)",
    "from-yellow-500": isDark ? "rgb(234, 179, 8)" : "rgb(234, 179, 8)",
    "from-indigo-500": isDark ? "rgb(99, 102, 241)" : "rgb(99, 102, 241)",
    "from-teal-500": isDark ? "rgb(20, 184, 166)" : "rgb(20, 184, 166)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)"
          : "linear-gradient(135deg, #f9fbfd 0%, #f6f9ff 50%, #ffffff 100%)",
        transition: "background 0.3s ease",
        paddingTop: "80px",
      }}
    >
      <Navbar />
      <div
        style={{
          padding: "40px 20px 64px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <motion.header
          style={{ textAlign: "center", marginBottom: 48, marginTop: 16 }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 800,
              marginBottom: 16,
              color: theme.text,
              letterSpacing: "-1px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Why{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #0078FF, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Pingnotes
            </span>
            ?
          </motion.h1>
          <motion.p
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              maxWidth: 600,
              margin: "0 auto",
              color: theme.textSecondary,
              lineHeight: 1.6,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your ultimate tool for smarter note organisation and collaboration.
          </motion.p>
        </motion.header>

        {/* Features Grid */}
        <motion.section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            maxWidth: "1400px",
            margin: "0 auto",
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.08 }}
          viewport={{ once: false }}
        >
          {featuresData.map((feature, idx) => {
            const colorClass = feature.color || "from-blue-500";
            const accentColor =
              colorMap[colorClass] || colorMap["from-blue-500"];

            return (
              <motion.div
                key={idx}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: false }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  rotateX: -3,
                  rotateY: 3,
                  cursor: "pointer",
                }}
              >
                {/* Background gradient card */}
                <div
                  style={{
                    background: isDark
                      ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                      : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                    border: isDark
                      ? `1px solid rgba(255,255,255,0.1)`
                      : `1px solid rgba(0,120,255,0.1)`,
                    borderRadius: 20,
                    padding: 28,
                    minHeight: 280,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isDark
                      ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                      : "0 4px 20px rgba(0, 120, 255, 0.08)",
                  }}
                >
                  {/* Icon Container */}
                  <motion.div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: isDark
                        ? `rgba(${accentColor === "rgb(59, 130, 246)" ? "59, 130, 246" : "168, 85, 247"}, 0.15)`
                        : `rgba(${accentColor === "rgb(59, 130, 246)" ? "59, 130, 246" : "168, 85, 247"}, 0.1)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      color: accentColor,
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Content */}
                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 10,
                        color: theme.text,
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: theme.textMuted,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    style={{
                      height: 2,
                      background: `linear-gradient(90deg, ${accentColor}, ${accentColor}00)`,
                      marginTop: 14,
                      borderRadius: 1,
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.08 + 0.3 }}
                    viewport={{ once: false }}
                  />
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 20,
                    background: `radial-gradient(circle at 50% 50%, ${accentColor}10, transparent 70%)`,
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.section>

        {/* Bottom CTA */}
        <motion.div
          style={{
            textAlign: "center",
            marginTop: 80,
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <p
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: theme.text,
              marginBottom: 16,
            }}
          >
            Ready to experience smarter note-taking?
          </p>
          <motion.button
            style={{
              padding: "14px 40px",
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(90deg, #0078FF, #00D4FF)",
              color: "#000",
              cursor: "pointer",
              boxShadow: isDark
                ? "0 4px 20px rgba(0, 212, 255, 0.2)"
                : "0 4px 20px rgba(0, 120, 255, 0.15)",
              transition: "all 0.3s ease",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/plans")}
          >
            Start Free Today
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
