import { Outlet, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardLayout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from query params if present
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token && !localStorage.getItem("userToken")) {
      localStorage.setItem("userToken", token);
      if (role) {
        localStorage.setItem("userRole", role);
      }
      // Clean up URL by removing query params
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="user-dashboard">
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
