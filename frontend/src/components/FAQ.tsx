import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is Pingnotes?",
    answer:
      "Pingnotes is a cloud-based note organizing platform designed for students. It helps in managing, storing, and accessing notes from anywhere with advanced search and collaboration features.",
  },
  {
    question: "Who can use the Pingnotes?",
    answer:
      "Any student – college, school or preparing for competitive exams – can use Pingnotes to organize their study materials and collaborate with peers.",
  },
  {
    question: "Is my data safe with Pingnotes?",
    answer:
      "Yes, we use secure cloud storage and encryption to protect your notes and personal information. All data is backed up and protected with industry-standard security protocols.",
  },
  {
    question: "How can I organize notes subject-wise or topic-wise?",
    answer:
      "You can create and manage tags and folders based on subjects or topics, and easily group your notes accordingly within the Pingnotes app. Our smart suggestion system helps categorize your content automatically.",
  },
  {
    question: "Can I share my notes with classmates?",
    answer:
      "Absolutely! With Pingnotes, you can instantly and securely share your notes with classmates via links or email invites. You can control who has access and what permissions they have.",
  },
  {
    question: "Does Pingnotes work offline?",
    answer:
      "Currently, Pingnotes is optimized for online access, but we are working on an offline mode for future updates that will allow you to access cached notes without internet.",
  },
  {
    question: "Can I sync my notes across multiple devices?",
    answer:
      "Yes! Pingnotes automatically syncs your notes across all your devices so you can access them anytime, anywhere. Changes made on one device are instantly reflected on all others.",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <motion.header
          style={{
            textAlign: "center",
            marginBottom: 48,
            marginTop: 16,
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
            <span
              style={{
                background: "linear-gradient(90deg, #0078FF, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FAQs
            </span>
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
            Find answers to common questions about Pingnotes
          </motion.p>
        </motion.header>

        {/* FAQ List */}
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                backdropFilter: "blur(10px)",
                border: `1px solid ${
                  isDark ? "rgba(255,255,255,0.1)" : "rgba(0, 120, 255, 0.1)"
                }`,
                background: isDark
                  ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                  : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isDark
                  ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                  : "0 4px 20px rgba(0, 120, 255, 0.08)",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{
                borderColor: isDark
                  ? "rgba(0, 212, 255, 0.3)"
                  : "rgba(0, 120, 255, 0.2)",
                boxShadow: isDark
                  ? "0 6px 24px rgba(0, 212, 255, 0.1)"
                  : "0 6px 24px rgba(0, 120, 255, 0.12)",
              }}
            >
              <motion.div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                  cursor: "pointer",
                  userSelect: "none",
                  background:
                    openIndex === index
                      ? isDark
                        ? "rgba(0, 212, 255, 0.08)"
                        : "rgba(0, 120, 255, 0.04)"
                      : "transparent",
                }}
                onClick={() => toggleFAQ(index)}
              >
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: theme.text,
                    marginRight: 16,
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {faq.question}
                </h3>
                <motion.div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background:
                      openIndex === index
                        ? "linear-gradient(90deg, #0078FF, #00D4FF)"
                        : isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 120, 255, 0.08)",
                    color:
                      openIndex === index
                        ? "#000"
                        : isDark
                          ? "rgba(255, 255, 255, 0.5)"
                          : "rgba(0, 120, 255, 0.6)",
                  }}
                  animate={{
                    rotate: openIndex === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? (
                    <FaChevronUp size={14} />
                  ) : (
                    <FaChevronDown size={14} />
                  )}
                </motion.div>
              </motion.div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                      overflow: "hidden",
                      borderTop: `1px solid ${
                        isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 120, 255, 0.1)"
                      }`,
                    }}
                  >
                    <p
                      style={{
                        padding: "20px 24px",
                        color: theme.textSecondary,
                        fontSize: 15,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          style={{
            textAlign: "center",
            marginTop: 48,
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p
            style={{
              fontSize: 16,
              color: theme.textMuted,
              marginBottom: 12,
            }}
          >
            Didn't find your answer?
          </p>
          <a
            href="mailto:support@pingnotes.com"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: theme.primary,
              textDecoration: "none",
              cursor: "pointer",
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Contact our support team →
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
