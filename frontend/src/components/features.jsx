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
  import "./features.css"
  const features = [
    //this is the features of our ping note;
    {
      title: "Organised Structure",
      icon: <FaFolderOpen size={28} color="#007bff" />,
      description:
        "Easily group notes by subjects, tags, or categories to stay organised.",
    },
    {
      title: "Quick Search",
      icon: <FaSearch size={28} color="#007bff" />,
      description: "Find notes instantly with easy search and filters.",
    },
    {
      title: "Collaborative Sharing",
      icon: <FaUsers size={28} color="#007bff" />,
      description: "Share notes securely with classmates or teachers.",
    },
    {
      title: "Cloud Backup",
      icon: <FaCloudUploadAlt size={28} color="#007bff" />,
      description: "Access your notes from anywhere with automatic backups.",
    },
    {
      title: "Smart Notifications",
      icon: <FaBell size={28} color="#007bff" />,
      description:
        "Stay updated with real-time alerts on shared and updated notes.",
    },
    {
      title: "Secure & Private",
      icon: <FaLock size={28} color="#007bff" />,
      description:
        "Your notes are encrypted and only visible to authorized users.",
    },
    {
      title: "Rich File Support",
      icon: <FaFileAlt size={28} color="#007bff" />,
      description: "Upload PDFs, Docs, and images along with text notes.",
    },
    {
      title: "Pinned & Starred Notes",
      icon: <FaStar size={28} color="#007bff" />,
      description: "Mark important notes so they’re always at your fingertips.",
    },
    {
      title: "AI-Powered Summaries",
      icon: <FaBrain size={28} color="#007bff" />,
      description: "Summarise long notes instantly using advanced AI.",
    },
    {
      title: "Smart Suggestions",
      icon: <FaLaptopCode size={28} color="#007bff" />,
      description: "Get automatic tag suggestions and topic link  while writing.",
    },
  ];

  export default function Features() {
    return (
      <>
        <Navbar />
        <div className="features-container">
          <motion.header
            className="features-header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>
              Why <span>PingNotes</span>?
            </h1>
            <p>Your ultimate tool for smarter note organisation.</p>
          </motion.header>
          <motion.section
            className="feature-cards"
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.3 }}
            viewport={{ once: true }}
          >
            {features.map((feature, idx) => (
              <motion.div
                className="card"
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="card-icon glow">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.section>
        </div>
      </>
    );
  }
