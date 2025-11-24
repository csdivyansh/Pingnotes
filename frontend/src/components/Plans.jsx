import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Plans.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const plans = [
  {
    name: "Free",
    price: "₹0/mo",
    features: ["Access to basic notes", "Limited uploads", "Community support"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹19.99/mo",
    features: [
      "Unlimited note storage",
      "Advanced search",
      "AI summarisation",
      "Priority support",
    ],
    highlighted: false,
  },
  {
    name: "Premium",
    price: "₹32.99/mo",
    features: [
      "Team collaboration tools",
      "Admin controls",
      "Custom integrations",
      "Dedicated manager",
      "Exclusive analytics",
    ],
    highlighted: false,
  },
];

export default function Plans() {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handlePaidPlan = async (planName) => {
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
        }
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
    <>
      <Navbar />
      <div className="plans-section no-bg">
        <motion.div
          className="plans-header"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Choose your perfect plan</h2>
          <p>
            From free forever to power-packed pro — find what fits you best.
          </p>
        </motion.div>

        <motion.div
          className="plan-cards"
          initial="hidden"
          whileInView="visible"
          transition={{ staggerChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {plans.map((plan, idx) => (
            <motion.div
              className={`plan-card`}
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.h3
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {plan.name}
              </motion.h3>
              <p className="plan-price">{plan.price}</p>
              <ul>
                {plan.features.map((feat, i) => (
                  <motion.li
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <FaCheckCircle className="check-icon" /> {feat}
                  </motion.li>
                ))}
              </ul>
              <motion.button
                className="choose-btn"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={
                  plan.name === "Free"
                    ? () => navigate("/login")
                    : () => handlePaidPlan(plan.name)
                }
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name
                  ? "Redirecting..."
                  : `Choose ${plan.name}`}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
