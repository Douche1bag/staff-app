import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEmployees: 0,
    totalCustomers: 0,
    reportedStock: 0,
  });

  // Fetch Dashboard Stats from API
  useEffect(() => {
    fetch("http://localhost:3000/api/admin-dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching dashboard data:", err));
  }, []);

  return (
    <div className="content">
      <h1>📊 Admin Dashboard</h1>
      <p>Quick overview of system activities.</p>

      {/* Dashboard Summary Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>{stats.totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="card">
          <h3>{stats.totalEmployees}</h3>
          <p>Employees</p>
        </div>
        <div className="card">
          <h3>{stats.totalCustomers}</h3>
          <p>Customers</p>
        </div>
        <div className="card alert">
          <h3>{stats.reportedStock}</h3>
          <p>Stock Alerts</p>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="quick-links">
        <button className="button" onClick={() => navigate("/admin/orders")}>📦 Manage Orders</button>
        <button className="button" onClick={() => navigate("/admin/employees")}>👥 Manage Employees</button>
        <button className="button" onClick={() => navigate("/admin/customers")}>🛒 View Customers</button>
        <button className="button alert" onClick={() => navigate("/admin/reports")}>⚠️ View Reports</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
