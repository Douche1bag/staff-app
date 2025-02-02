import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./admin/Dashboard";
import Orders from "./admin/Orders";
import Employees from "./admin/Employees";
import Customers from "./admin/Customers";
import Reports from "./admin/Reports";  // Import Reports Page for Admin
import ChefDashboard from "./chef/Dashboard";
import ChefOrders from "./chef/ChefOrders";  // Import Chef Orders Management
import Stock from "./chef/Stock";  // Import Stock Management for Chef
import Login from "./auth/Login";
import "./style.css";

function App() {
  const [role, setRole] = useState(null); // Store user role

  return (
    <Router>
      {role && <Sidebar role={role} />}
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login setRole={setRole} />} />

        {/* Redirect to login if no role is selected */}
        {!role && <Route path="*" element={<Navigate to="/login" />} />}

        {/* Admin Routes */}
        {role === "admin" && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/reports" element={<Reports />} />  {/* Reports Page for Admin */}
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </>
        )}

        {/* Chef Routes */}
        {role === "chef" && (
          <>
            <Route path="/chef/dashboard" element={<ChefDashboard />} />
            <Route path="/chef/chef-orders" element={<ChefOrders />} /> {/* Chef Orders Page */}
            <Route path="/chef/stock" element={<Stock />} /> {/* Stock Overview for Chef */}
            <Route path="*" element={<Navigate to="/chef/dashboard" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
