import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const ChefDashboard = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [cookingOrders, setCookingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch order counts
        const countsResponse = await fetch("http://localhost:3000/api/chef/order-counts");
        if (!countsResponse.ok) throw new Error(`HTTP error! status: ${countsResponse.status}`);
        const countsData = await countsResponse.json();
        setPendingOrders(countsData.pending || 0);
        setCookingOrders(countsData.cooking || 0);
        setCompletedOrders(countsData.completed || 0);

        // Fetch recent orders
        const recentResponse = await fetch("http://localhost:3000/api/chef/recent-orders");
        if (!recentResponse.ok) throw new Error(`HTTP error! status: ${recentResponse.status}`);
        const recentData = await recentResponse.json();
        setRecentOrders(recentData);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="content">
      <div className="dashboard-header">
        <h1>👨‍🍳 Chef Dashboard</h1>
        <p>Overview of orders and tasks</p>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="dashboard-cards">
        <div className="card pending">
          <h3>{pendingOrders}</h3>
          <p>Pending Orders</p>
          <span className="icon">🕒</span>
        </div>
        <div className="card cooking">
          <h3>{cookingOrders}</h3>
          <p>Currently Cooking</p>
          <span className="icon">👨‍🍳</span>
        </div>
        <div className="card completed">
          <h3>{completedOrders}</h3>
          <p>Completed Today</p>
          <span className="icon">✅</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Plan</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.plan}</td>
                    <td>{formatDate(order.date_order)}</td>
                    <td>
                      <span className={`status ${order.order_status.toLowerCase()}`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => navigate("/chef/orders")} className="action-button">
          <span>📋</span> View All Orders
        </button>
        <button onClick={() => navigate("/chef/stock")} className="action-button">
          <span>📦</span> Check Stock
        </button>
      </div>
    </div>
  );
};

export default ChefDashboard;
