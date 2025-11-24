import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import DashboardCard from "./DashboardCard";
import apiService from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    notes: 0,
    users: 0,
    teachers: 0,
    groups: 0,
    subjects: 0,
    admins: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getAdminDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <AdminSidebar />
        <main className="main-content">
          <motion.div 
            className="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>📊</div>
            Loading dashboard...
          </motion.div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <AdminSidebar />
        <main className="main-content">
          <motion.div 
            className="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>⚠️</div>
            {error}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <AdminSidebar />
      <main className="main-content">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Admin Dashboard
        </motion.h1>
        
        <motion.div 
          className="cards-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DashboardCard title="Total Notes" count={stats.notes} iconClass="fa-file-alt" color="blue" />
          <DashboardCard title="Students" count={stats.users} iconClass="fa-users" color="green" />
          <DashboardCard title="Teachers" count={stats.teachers} iconClass="fa-chalkboard-teacher" color="yellow" />
          <DashboardCard title="Groups" count={stats.groups} iconClass="fa-folder" color="purple" />
          <DashboardCard title="Subjects" count={stats.subjects} iconClass="fa-book" color="pink" />
          <DashboardCard title="Admins" count={stats.admins} iconClass="fa-user-shield" color="red" />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;