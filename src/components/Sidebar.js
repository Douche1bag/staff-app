import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  
  console.log("Sidebar role:", role); // Debug log

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // Force reload to clear any state
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Pet Food</h2>
      </div>
      <div className="sidebar-nav">
        {role === "chef" && (
          <>
            <button onClick={() => navigate("/chef/dashboard")}>
              Dashboard
            </button>
            <button onClick={() => navigate("/chef/orders")}>
              Orders
            </button>
            <button onClick={() => navigate("/chef/meal-queue")}>
              Meal Queue
            </button>
            <button onClick={() => navigate("/chef/stock")}>
              Stock
            </button>
          </>
        )}

        {role === "admin" && (
          <>
            <button onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </button>
            <button onClick={() => navigate("/admin/orders")}>
              Orders
            </button>
            <button onClick={() => navigate("/admin/employees")}>
              Employees
            </button>
            <button onClick={() => navigate("/admin/customers")}>
              Customers
            </button>
            <button onClick={() => navigate("/admin/reports")}>
              Reports
            </button>
          </>
        )}

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;