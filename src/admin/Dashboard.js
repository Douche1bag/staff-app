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

  // Fetch Dashboard Stats from API with real-time updates
  useEffect(() => {
    fetchDashboardStats(); // Initial fetch

    // Set up interval for real-time updates (every 5 seconds)
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [ordersRes, employeesRes, customersRes, stockRes] = await Promise.all([
        fetch("http://localhost:3000/api/admin/orders/count"),
        fetch("http://localhost:3000/api/admin/employees/count"),
        fetch("http://localhost:3000/api/admin/customers/count"),
        fetch("http://localhost:3000/api/admin/stock-reports/count")
      ]);

      const orders = await ordersRes.json();
      const employees = await employeesRes.json();
      const customers = await customersRes.json();
      const stock = await stockRes.json();

      setStats({
        totalOrders: orders.count,
        totalEmployees: employees.count,
        totalCustomers: customers.count,
        reportedStock: stock.count
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

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
        <div className={`card ${stats.reportedStock > 0 ? 'alert' : ''}`}>
          <h3>{stats.reportedStock}</h3>
          <p>Stock Alerts</p>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="quick-links">
        <button className="button" onClick={() => navigate("/admin/orders")}>📦 Manage Orders</button>
        <button className="button" onClick={() => navigate("/admin/employees")}>👥 Manage Employees</button>
        <button className="button" onClick={() => navigate("/admin/customers")}>🛒 View Customers</button>
        <button className={`button ${stats.reportedStock > 0 ? 'alert' : ''}`} onClick={() => navigate("/admin/reports")}>
          ⚠️ View Reports {stats.reportedStock > 0 && `(${stats.reportedStock})`}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
