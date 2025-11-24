// FAQpage.js
import React, { useState } from "react";
import "./FAQpage.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";

const faqs = [
  {
    question: "What is Pingnotes?",
    answer:
      "Pingnotes are  a cloud-based note organizing platform designed for students. It helps in managing, storing, and accessing notes from anywhere.",
  },
  {
    question: "Who can use the Pingnotes?",
    answer:
      "Any student – college , school or preparing for competitive exams – can use Pingnotes to organize their study materials.",
  },
  {
    question: "Is my data safe with Pingnotes?",
    answer:
      "Yes, we use secure cloud storage and encryption to protect your notes and personal information.",
   },
  {
    question: "How can I organize notes subject-wise or topic-wise?",
    answer:
      "You can create and manage tags and folders based on subjects or topics, and easily group your notes accordingly within the Pingnotes app.",
  },
  {
    question: "Can I share my notes with classmates?",
    answer:
      "Absolutely! With Pingnotes, you can instantly and securely share your notes with classmates via links or email invites.",
  },
  
  {
    question: "Does PingNotes work offline?",
    answer:
      "Currently, PingNotes is optimized for online access, but we are working on an offline mode for future updates.",
  },

  {
   question: "Can I sync my notes across multiple devices?",

  answer:"Yes! Pingnotes automatically syncs your notes across all your devices so you can access them anytime, anywhere.",
  },
];

const FAQpage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="faq-container">
        <header className="faq-header">
          <h1>
            <span className="blue">Ping</span>notes
          </h1>
          <p className="tagline">
            Your Study Companion — Simplified & Organized
          </p>
        </header>

        <motion.div
          className="faq-list"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              className="faq-card"
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFAQ(index)}
              >
                <h3>{faq.question}</h3>
                <div className="faq-icon-container">
                  {openIndex === index ? (
                    <FaChevronUp className="dropdown-icon" />
                  ) : (
                    <FaChevronDown className="dropdown-icon" />
                  )}
                </div>
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default FAQpage;
