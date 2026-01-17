import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaBook, FaUsers, FaFolder, FaHeart, FaRocket } from "react-icons/fa";
import Navbar from "./Navbar";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";
import { motion } from "framer-motion";

interface Developer {
  initials: string;
  name: string;
  role: string;
  accentColor: string;
}

const developers: Developer[] = [
  {
    initials: "GP",
    name: "Garv Pathak",
    role: "Frontend Developer",
    accentColor: "rgb(59, 130, 246)",
  },
  {
    initials: "DV",
    name: "Divyansh Varshney",
    role: "Backend, API & Devops",
    accentColor: "rgb(168, 85, 247)",
  },
  {
    initials: "AK",
    name: "Amit Kumar",
    role: "Frontend Developer",
    accentColor: "rgb(34, 211, 238)",
  },
  {
    initials: "GC",
    name: "Gaurav Chaudhary",
    role: "Database Specialist",
    accentColor: "rgb(236, 72, 153)",
  },
  {
    initials: "HB",
    name: "Hardeep Bainiwal",
    role: "Backend Developer",
    accentColor: "rgb(34, 197, 94)",
  },
];

const features = [
  {
    icon: <FaBook size={28} />,
    title: "📘 Organize Subjects",
    description: "Manage your subjects and topics in a structured format.",
    accentColor: "rgb(59, 130, 246)",
  },
  {
    icon: <FaUsers size={28} />,
    title: "👥 Collaborate with Groups",
    description: "Share notes and work together in real time.",
    accentColor: "rgb(168, 85, 247)",
  },
  {
    icon: <FaFolder size={28} />,
    title: "📂 File Management",
    description: "Keep all academic files in one secure location.",
    accentColor: "rgb(34, 211, 238)",
  },
];

const About: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* About Header */}
        <motion.div
          style={{
            maxWidth: 800,
            margin: "0 auto 48px auto",
            textAlign: "center",
          }}
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            About{" "}
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
          </motion.h1>
          <motion.p
            style={{
              fontSize: "clamp(16px, 2.5vw, 18px)",
              color: theme.textSecondary,
              lineHeight: 1.6,
              marginBottom: 16,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Pingnotes is a modern study companion designed to keep students
            connected and organized. It offers a clean space where learners can
            share notes, stay updated, and support each other through their
            academic journey. Built with a focus on clarity and ease, Pingnotes
            helps students cut through the noise and keep their studies on
            track. It's all about smarter learning, better collaboration, and a
            calm, collected approach to education.
          </motion.p>
        </motion.div>

        {/* Developer Section */}
        <motion.div
          style={{
            marginBottom: 64,
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            style={{
              fontSize: 32,
              fontWeight: 800,
              textAlign: "center",
              marginBottom: 32,
              color: theme.text,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Developed By
          </motion.h2>
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {developers.map((dev, idx) => (
              <motion.div
                key={idx}
                style={{
                  textAlign: "center",
                  padding: 24,
                  borderRadius: 20,
                  background: isDark
                    ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                  border: isDark
                    ? `1px solid rgba(255,255,255,0.1)`
                    : `1px solid rgba(0, 120, 255, 0.1)`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isDark
                    ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : "0 4px 20px rgba(0, 120, 255, 0.08)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <motion.div
                  style={{
                    width: 80,
                    height: 80,
                    margin: "0 auto 16px auto",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${dev.accentColor}, ${dev.accentColor}dd)`,
                    boxShadow: `0 4px 20px ${dev.accentColor}30`,
                  }}
                  whileHover={{ scale: 1.15 }}
                >
                  {dev.initials}
                </motion.div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 4,
                    color: theme.text,
                  }}
                >
                  {dev.name}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: theme.textMuted,
                    lineHeight: 1.5,
                  }}
                >
                  {dev.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              marginBottom: 64,
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                style={{
                  padding: 24,
                  borderRadius: 20,
                  textAlign: "center",
                  background: isDark
                    ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                  border: isDark
                    ? `1px solid rgba(255,255,255,0.1)`
                    : `1px solid rgba(0, 120, 255, 0.1)`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isDark
                    ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : "0 4px 20px rgba(0, 120, 255, 0.08)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <motion.div
                  style={{
                    width: 56,
                    height: 56,
                    margin: "0 auto 12px auto",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${feature.accentColor}22, ${feature.accentColor}11)`,
                    color: feature.accentColor,
                  }}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: theme.text,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: theme.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          style={{
            textAlign: "center",
            fontSize: 16,
            color: theme.textSecondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FaRocket style={{ color: "rgb(59, 130, 246)" }} />
          Built with{" "}
          <FaHeart
            style={{
              color: "rgb(239, 68, 68)",
              animation: "pulse 2s infinite",
            }}
          />{" "}
          for modern education.
        </motion.div>
      </div>
    </div>
  );
};

export default About;
