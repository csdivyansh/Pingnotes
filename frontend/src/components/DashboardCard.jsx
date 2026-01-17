import React from "react";
import { motion } from "framer-motion";

const DashboardCard = ({ title, count, iconClass, color }) => {
  return (
    <motion.div 
      className={`card ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="content">
        <p className="title">{title}</p>
        <h2 className="count">{count}</h2>
      </div>
      <i className={`fas ${iconClass} icon`}></i>
    </motion.div>
  );
};

export default DashboardCard;