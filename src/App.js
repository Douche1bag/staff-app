import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.js";
import AdminDashboard from "./admin/Dashboard.js";
import Orders from "./admin/Orders.js";
import Employees from "./admin/Employees.js";
import Customers from "./admin/Customers.js";
import Reports from "./admin/Reports.js";
import ChefDashboard from "./chef/Dashboard.js";
import ChefOrders from "./chef/ChefOrders.js";
import MealQueue from "./chef/MealQueue.js";
import Stock from "./chef/Stock.js";
import Login from "./auth/Login.js";
import "./style.css";

function App() {
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem("role");
    console.log("Initial role from localStorage:", savedRole); // Debug log
    return savedRole || null;
  });

  useEffect(() => {
    console.log("Current role:", role); // Debug log
  }, [role]);

  return (
    <Router>
      <div className="app">
        {role && (
          <>
            <Sidebar />
            <div className="main-content">
              <Routes>
                {role === "chef" && (
                  <>
                    <Route path="/chef" element={<ChefDashboard />} />
                    <Route path="/chef/dashboard" element={<ChefDashboard />} />
                    <Route path="/chef/orders" element={<ChefOrders />} />
                    <Route path="/chef/meal-queue" element={<MealQueue />} />
                    <Route path="/chef/stock" element={<Stock />} />
                    <Route path="*" element={<Navigate to="/chef" />} />
                  </>
                )}

                {role === "admin" && (
                  <>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/orders" element={<Orders />} />
                    <Route path="/admin/employees" element={<Employees />} />
                    <Route path="/admin/customers" element={<Customers />} />
                    <Route path="/admin/reports" element={<Reports />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                  </>
                )}
              </Routes>
            </div>
          </>
        )}
        
        {!role && (
          <Routes>
            <Route path="/login" element={<Login setRole={setRole} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;