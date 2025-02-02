import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="sidebar">
      <h2>{role === "admin" ? "Admin Panel" : "Chef Panel"}</h2>
      <ul>
        {role === "admin" && (
          <>
            <li><Link to="/admin/dashboard">📋 Admin Dashboard</Link></li>
            <li><Link to="/admin/orders">📦 Order Management</Link></li>
            <li><Link to="/admin/stock">📊 Stock Management</Link></li>
            <li><Link to="/admin/employees">👥 Employees</Link></li>
            <li><Link to="/admin/customers">🛒 Customers</Link></li>
          </>
        )}

        {role === "chef" && (
          <>
            <li><Link to="/chef/dashboard">👨‍🍳 Chef Dashboard</Link></li>
            <li><Link to="/chef/meal-queue">🍽️ Meal Queue</Link></li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
