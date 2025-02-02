import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <h2>{role === "admin" ? "Admin Panel" : "Chef Panel"}</h2>
      <ul>
        {role === "admin" && (
          <>
            <li><Link to="/admin/dashboard">📋 Dashboard</Link></li>
            <li><Link to="/admin/orders">📦 Order Management</Link></li>
            <li><Link to="/admin/employees">👥 Employee Management</Link></li>
            <li><Link to="/admin/customers">🛒 Customer Management</Link></li>
            <li><Link to="/admin/reports">⚠️ Stock Reports</Link></li>
          </>
        )}

        {role === "chef" && (
          <>
            <li><Link to="/chef/dashboard">👨‍🍳 Chef Dashboard</Link></li>
            <li><Link to="/chef/chef-orders">📋 Current Orders</Link></li>
            <li><Link to="/chef/stock">📊 Stock Overview</Link></li>
          </>
        )}
      </ul>

      <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
};

export default Sidebar;
