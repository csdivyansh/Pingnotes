import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  // Helper to add alpha to rgb string like "rgb(59, 130, 246)"
  const withAlpha = (rgb: string, alpha: number) => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return rgb;
    const [, r, g, b] = match;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Use a success accent color aligned with Plans.tsx style language
  const accentColor = "rgb(16, 185, 129)"; // emerald tone

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: isDark
      ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)"
      : "linear-gradient(135deg, #f9fbfd 0%, #f6f9ff 50%, #ffffff 100%)",
    transition: "background 0.3s ease",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
  };

  const cardStyle: React.CSSProperties = {
    background: isDark
      ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
    borderRadius: 24,
    padding: "48px 36px",
    maxWidth: 720,
    width: "100%",
    boxShadow: isDark
      ? `0 8px 32px ${withAlpha(accentColor, 0.12)}`
      : `0 8px 32px ${withAlpha(accentColor, 0.12)}`,
    border: isDark
      ? `2px solid ${withAlpha(accentColor, 0.25)}`
      : `2px solid ${withAlpha(accentColor, 0.2)}`,
    backdropFilter: "blur(10px)",
    position: "relative",
    zIndex: 2,
  };

  const decorativeBlobStyle: React.CSSProperties = {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.08,
    filter: "blur(48px)",
  };

  const checkIconStyle: React.CSSProperties = {
    width: 84,
    height: 84,
    margin: "0 auto 28px",
    background: `linear-gradient(135deg, ${accentColor}, ${withAlpha(accentColor, 0.85)})`,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 20px 40px ${withAlpha(accentColor, 0.25)}`,
  };

  const checkmarkStyle: React.CSSProperties = {
    color: "#ffffff",
    fontSize: "48px",
    fontWeight: "bold",
    lineHeight: "1",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "clamp(28px, 4.5vw, 40px)",
    fontWeight: 800,
    color: theme.text,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: "-0.5px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "clamp(14px, 2.2vw, 18px)",
    color: theme.textSecondary,
    margin: "0 auto 28px",
    textAlign: "center",
    lineHeight: 1.6,
    maxWidth: 640,
  };

  const featureListStyle: React.CSSProperties = {
    margin: "24px 0 28px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const featureItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 15,
    color: theme.textSecondary,
  };

  const checkIconSmallStyle: React.CSSProperties = {
    color: accentColor,
    fontSize: 18,
    flexShrink: 0,
    marginTop: 2,
    minWidth: 20,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexDirection: "column",
    marginTop: 8,
  };

  const primaryButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: `linear-gradient(90deg, ${accentColor}, ${withAlpha(accentColor, 0.85)})`,
    color: "#000",
    border: "none",
    boxShadow: `0 4px 20px ${withAlpha(accentColor, 0.18)}`,
  };

  const secondaryButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 20px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: isDark
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 120, 255, 0.08)",
    color: accentColor,
    border: `1.5px solid ${withAlpha(accentColor, 0.25)}`,
  };

  return (
    <div style={containerStyle}>
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          background: `radial-gradient(circle at 50% 30%, ${withAlpha(accentColor, 0.08)}, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Decorative blobs */}
      <div
        style={{
          ...decorativeBlobStyle,
          width: 320,
          height: 320,
          top: -60,
          left: -120,
          background: accentColor,
        }}
      />
      <div
        style={{
          ...decorativeBlobStyle,
          width: 280,
          height: 280,
          bottom: -70,
          right: -70,
          background: withAlpha(accentColor, 0.7),
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={cardStyle}
      >
        {/* Animated check icon */}
        <motion.div
          initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 14,
            delay: 0.1,
          }}
          style={checkIconStyle}
        >
          <FaCheckCircle size={42} color="#ffffff" />
        </motion.div>

        {/* Title and subtitle */}
        <h1 style={titleStyle}>
          Payment
          <span
            style={{
              marginLeft: 8,
              background: "linear-gradient(90deg, #0078FF, #00D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Successful
          </span>
          !
        </h1>
        <p style={subtitleStyle}>
          Thank you for your purchase. Your plan is now active. You now have
          access to all premium features and priority support.
        </p>

        {/* Feature list */}
        <div style={featureListStyle}>
          <div style={featureItemStyle}>
            <span style={checkIconSmallStyle}>✓</span>
            <span>Premium features unlocked immediately</span>
          </div>
          <div style={featureItemStyle}>
            <span style={checkIconSmallStyle}>✓</span>
            <span>Unlimited file uploads</span>
          </div>
          <div style={featureItemStyle}>
            <span style={checkIconSmallStyle}>✓</span>
            <span>Priority support</span>
          </div>
          <div style={featureItemStyle}>
            <span style={checkIconSmallStyle}>✓</span>
            <span>Early access to new features</span>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div
          style={{
            height: 2,
            background: `linear-gradient(90deg, ${accentColor}, ${withAlpha(accentColor, 0)})`,
            marginBottom: 18,
            borderRadius: 1,
          }}
        />

        {/* Buttons */}
        <div style={buttonContainerStyle}>
          <motion.button
            style={primaryButtonStyle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </motion.button>
          <motion.button
            style={secondaryButtonStyle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/settings")}
          >
            Manage Plan
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
