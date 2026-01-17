import React, { useState } from "react";
import { FaCheckCircle, FaCrown, FaRocket, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Safely add alpha to an rgb color string like "rgb(59, 130, 246)".
const withAlpha = (rgb: string, alpha: number) => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return rgb;
  const [, r, g, b] = match;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface Plan {
  name: string;
  price: string;
  oldPrice?: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  gradient: string;
  accentColor: string;
}

const plans: Plan[] = [
  {
    name: "Go",
    price: "₹0",
    oldPrice: "₹99",
    icon: <FaStar size={28} />,
    features: [
      "Access to basic notes",
      "500 MB storage",
      "Limited uploads (10/month)",
      "Community support",
    ],
    gradient: "from-gray-500 to-gray-600",
    accentColor: "rgb(107, 114, 128)",
  },
  {
    name: "Pro",
    price: "₹199",
    icon: <FaRocket size={28} />,
    features: [
      "Unlimited note storage",
      "Advanced search & filters",
      "AI-powered summarisation",
      "Priority email support",
      "Custom tags & categories",
      "File versioning",
    ],
    popular: true,
    gradient: "from-blue-500 to-cyan-500",
    accentColor: "rgb(59, 130, 246)",
  },
  {
    name: "Premium",
    price: "₹499",
    icon: <FaCrown size={28} />,
    features: [
      "Everything in Pro, plus:",
      "Team collaboration (5 members)",
      "Admin & permission controls",
      "Custom integrations",
      "24/7 dedicated support",
      "Advanced analytics & insights",
      "API access",
    ],
    gradient: "from-purple-500 to-pink-500",
    accentColor: "rgb(168, 85, 247)",
  },
  {
    name: "Institutions",
    price: "₹1000",
    oldPrice: "₹10000",
    icon: <FaRocket size={28} />,
    features: [
      "Everything in Premium, plus:",
      "Unlimited team members",
      "Advanced security & compliance",
      "Dedicated account manager",
      "Custom SLA & support",
      "White-label options",
      "Enterprise integrations",
      "Advanced analytics & reporting",
    ],
    gradient: "from-orange-500 to-red-500",
    accentColor: "rgb(249, 115, 22)",
  },
];

const Plans: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePaidPlan = async (planName: string) => {
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("adminToken");
    if (!token) {
      localStorage.setItem("postLoginRedirect", "/plans");
      navigate("/login");
      return;
    }
    setLoadingPlan(planName);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planName }),
        },
      );
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start payment session.");
      }
    } catch (err) {
      alert("Error connecting to payment server.");
    } finally {
      setLoadingPlan(null);
    }
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
        overflowX: "hidden",
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
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            marginTop: 16,
            maxWidth: 800,
            margin: "0 auto 48px auto",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: 800,
              marginBottom: 16,
              color: theme.text,
              letterSpacing: "-1px",
            }}
          >
            Choose your{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #0078FF, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              perfect plan
            </span>
          </h2>
          <p
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              maxWidth: 600,
              margin: "0 auto",
              color: theme.textSecondary,
              lineHeight: 1.6,
            }}
          >
            From free forever to power-packed pro — find what fits you best.
          </p>
        </div>

        {/* Plans Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 28,
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          {plans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",
                overflow: "visible",
              }}
            >
              {/* Card */}
              <div
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                  border: isDark
                    ? `2px solid ${
                        plan.popular
                          ? "rgba(0, 212, 255, 0.3)"
                          : "rgba(255,255,255,0.1)"
                      }`
                    : `2px solid ${
                        plan.popular
                          ? "rgba(0, 120, 255, 0.2)"
                          : "rgba(0, 120, 255, 0.1)"
                      }`,
                  borderRadius: 24,
                  padding: 24,
                  minHeight: 540,
                  display: "flex",
                  flexDirection: "column",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isDark
                    ? plan.popular
                      ? "0 8px 32px rgba(0, 212, 255, 0.15)"
                      : "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : plan.popular
                      ? "0 8px 32px rgba(0, 120, 255, 0.12)"
                      : "0 4px 20px rgba(0, 120, 255, 0.08)",
                  marginTop: 0,
                  position: "relative",
                  zIndex: plan.popular ? 10 : 1,
                }}
              >
                {/* Popular Badge - Inside Card */}
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "linear-gradient(90deg, #0078FF, #00D4FF)",
                      color: "#000",
                      padding: "6px 16px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      zIndex: 20,
                      boxShadow: "0 4px 16px rgba(0, 212, 255, 0.3)",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}
                {/* Icon Container */}
                <motion.div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${withAlpha(plan.accentColor, 0.13)}, ${withAlpha(plan.accentColor, 0.07)})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    color: plan.accentColor,
                    transition: "all 0.3s ease",
                  }}
                  whileHover={{ scale: 1.15, rotate: 10 }}
                >
                  {plan.icon}
                </motion.div>

                {/* Plan Name */}
                <h3
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    marginBottom: 8,
                    color: theme.text,
                  }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "baseline", gap: 10 }}
                  >
                    {plan.oldPrice && (
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: theme.textMuted,
                          textDecoration: "line-through",
                        }}
                      >
                        {plan.oldPrice}
                      </span>
                    )}
                    <div
                      style={{
                        fontSize: 42,
                        fontWeight: 800,
                        background: `linear-gradient(90deg, ${plan.accentColor}, ${withAlpha(plan.accentColor, 0.85)})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: 4,
                      }}
                    >
                      {plan.price}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: theme.textMuted,
                    }}
                  >
                    {plan.name === "Go" ? "Forever" : "per month"}
                  </div>
                </div>

                {/* Features List */}
                <ul
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: 28,
                    flex: 1,
                  }}
                >
                  {plan.features.map((feat, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: 12,
                        fontSize: 14,
                        color: theme.textSecondary,
                        lineHeight: 1.5,
                      }}
                    >
                      <FaCheckCircle
                        size={18}
                        style={{
                          color: plan.accentColor,
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Accent Line */}
                <div
                  style={{
                    height: 2,
                    background: `linear-gradient(90deg, ${plan.accentColor}, ${withAlpha(plan.accentColor, 0)})`,
                    marginBottom: 20,
                    borderRadius: 1,
                  }}
                />

                {/* CTA Button */}
                <button
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background: plan.popular
                      ? `linear-gradient(90deg, ${plan.accentColor}, ${withAlpha(plan.accentColor, 0.85)})`
                      : isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 120, 255, 0.08)",
                    color: plan.popular ? "#000" : plan.accentColor,
                    border: plan.popular
                      ? "none"
                      : `1.5px solid ${withAlpha(plan.accentColor, 0.25)}`,
                    boxShadow: plan.popular
                      ? `0 4px 20px ${withAlpha(plan.accentColor, 0.18)}`
                      : "none",
                  }}
                  onClick={
                    plan.name === "Go"
                      ? () => navigate("/login")
                      : () => handlePaidPlan(plan.name)
                  }
                >
                  {loadingPlan === plan.name
                    ? "Redirecting..."
                    : `Choose ${plan.name}`}
                </button>
              </div>

              {/* Glow Effect */}
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 24,
                    background: `radial-gradient(circle at 50% 50%, ${withAlpha(plan.accentColor, 0.08)}, transparent 70%)`,
                    opacity: 0.5,
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Bottom FAQ CTA */}
        <div
          style={{
            textAlign: "center",
            marginTop: 80,
          }}
        >
          <p
            style={{
              fontSize: 16,
              color: theme.textMuted,
              marginBottom: 8,
            }}
          >
            Need help choosing? Check our
          </p>
          <a
            href="/faq"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: theme.primary,
              textDecoration: "none",
              cursor: "pointer",
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            FAQs →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Plans;
