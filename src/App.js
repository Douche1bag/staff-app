import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./admin/Dashboard";
import Orders from "./admin/Orders";
import Stock from "./admin/Stock";
import Employees from "./admin/Employees";
import Customers from "./admin/Customers";
import ChefDashboard from "./chef/Dashboard";
import MealQueue from "./chef/MealQueue";
import "./style.css";

function App() {
  const [role, setRole] = useState("admin"); // Change to "chef" for testing

  return (
    <Router>
      <Sidebar role={role} />
      <Routes>
        {/* Admin Routes */}
        {role === "admin" && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/stock" element={<Stock />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/customers" element={<Customers />} />
          </>
        )}

        {/* Chef Routes */}
        {role === "chef" && (
          <>
            <Route path="/chef/dashboard" element={<ChefDashboard />} />
            <Route path="/chef/meal-queue" element={<MealQueue />} />
          </>
        )}

        {/* Redirect to the correct dashboard */}
        <Route path="/" element={role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/chef/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
