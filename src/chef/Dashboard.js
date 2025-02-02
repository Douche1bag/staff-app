import React from "react";
import { useNavigate } from "react-router-dom";

const ChefDashboard = () => {
  const navigate = useNavigate();

  // Mock data (Replace with API data if needed)
  const pendingOrders = 7;
  const mealQueue = 5;
  const reportedStock = 2; // Stock issues reported to Admin

  return (
    <div className="content">
      <h1>👨‍🍳 Chef Dashboard</h1>
      <p>Quick overview of current tasks.</p>

      {/* Dashboard Summary Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>{pendingOrders}</h3>
          <p>Pending Orders</p>
        </div>
        <div className="card">
          <h3>{mealQueue}</h3>
          <p>Meals in Queue</p>
        </div>
        <div className="card alert">
          <h3>{reportedStock}</h3>
          <p>Stock Alerts</p>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="quick-links">
        <button className="button" onClick={() => navigate("/chef/chef-orders")}>📋 View Orders</button>
        <button className="button" onClick={() => navigate("/chef/stock")}>📊 Check Stock</button>
      </div>
    </div>
  );
};

export default ChefDashboard;
