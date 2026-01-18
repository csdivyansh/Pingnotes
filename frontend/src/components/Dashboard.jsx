import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import DashboardCard from "./DashboardCard";
import apiService from "../services/api";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    notes: 0,
    users: 0,
    teachers: 0,
    groups: 0,
    subjects: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extract token from query params if present
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token && !localStorage.getItem("adminToken")) {
      localStorage.setItem("adminToken", token);
      if (role) {
        localStorage.setItem("adminRole", role);
      }
      // Clean up URL by removing query params
      navigate("/admin/dashboard", { replace: true });
    }
  }, [searchParams, navigate]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 relative overflow-x-hidden">
        <AdminSidebar />
        <main className="ml-64 flex-1 p-8 bg-transparent min-h-screen">
          <div className="bg-white/90 backdrop-blur-sm p-10 rounded-2xl text-center text-lg text-blue-700 font-semibold shadow-lg border border-white/20">
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 relative overflow-x-hidden">
        <AdminSidebar />
        <main className="ml-64 flex-1 p-8 bg-transparent min-h-screen">
          <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl text-center text-lg text-red-600 font-semibold shadow-lg border border-white/20">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 relative overflow-x-hidden">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 bg-transparent min-h-screen">
        <h1 className="text-4xl mb-8 text-blue-800 font-extrabold drop-shadow-sm">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          <DashboardCard
            title="Total Notes"
            count={stats.notes}
            iconClass="fa-file-alt"
            color="blue"
          />
          <DashboardCard
            title="Students"
            count={stats.users}
            iconClass="fa-users"
            color="green"
          />
          <DashboardCard
            title="Teachers"
            count={stats.teachers}
            iconClass="fa-chalkboard-teacher"
            color="yellow"
          />
          <DashboardCard
            title="Groups"
            count={stats.groups}
            iconClass="fa-folder"
            color="purple"
          />
          <DashboardCard
            title="Subjects"
            count={stats.subjects}
            iconClass="fa-book"
            color="pink"
          />
          <DashboardCard
            title="Admins"
            count={stats.admins}
            iconClass="fa-user-shield"
            color="red"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
