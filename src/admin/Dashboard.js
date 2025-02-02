import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock data (Replace with API data if needed)
  const totalOrders = 25;
  const totalEmployees = 5;
  const totalCustomers = 150;
  const reportedStock = 2; // Number of reported low stock items

  return (
    <div className="content">
      <h1>📊 Admin Dashboard</h1>
      <p>Quick overview of system activities.</p>

      {/* Dashboard Summary Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>{totalOrders}</h3>
          <p>Total Orders</p>
        </div>
        <div className="card">
          <h3>{totalEmployees}</h3>
          <p>Employees</p>
        </div>
        <div className="card">
          <h3>{totalCustomers}</h3>
          <p>Customers</p>
        </div>
        <div className="card alert">
          <h3>{reportedStock}</h3>
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
