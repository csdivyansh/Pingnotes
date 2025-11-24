  import React, { useEffect, useState } from "react";
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
            <div className="loading">Loading dashboard...</div>
          </main>
        </div>
      );
    }

    if (error) {
      return (
        <div className="dashboard-container">
          <AdminSidebar />
          <main className="main-content">
            <div className="error">{error}</div>
          </main>
        </div>
      );
    }

    return (
      <div className="dashboard-container">
        <AdminSidebar />
        <main className="main-content">
          <h1>Admin Dashboard</h1>
          <div className="cards-grid">
            <DashboardCard title="Total Notes" count={stats.notes} iconClass="fa-file-alt" color="blue" />
            <DashboardCard title="Students" count={stats.users} iconClass="fa-users" color="green" />
            <DashboardCard title="Teachers" count={stats.teachers} iconClass="fa-chalkboard-teacher" color="yellow" />
            <DashboardCard title="Groups" count={stats.groups} iconClass="fa-folder" color="purple" />
            <DashboardCard title="Subjects" count={stats.subjects} iconClass="fa-book" color="pink" />
            <DashboardCard title="Admins" count={stats.admins} iconClass="fa-user-shield" color="red" />
          </div>
        </main>
      </div>
    );
  };

  export default Dashboard;