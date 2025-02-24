import React, { useEffect, useState } from "react";
import "./MealQueue.css";

const MealQueue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/chef/orders");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders: " + err.message);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/chef/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      setOrders(orders.map(order => 
        order.order_id === orderId 
          ? { ...order, order_status: newStatus }
          : order
      ));
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status");
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="content">
      <div className="meal-queue-header">
        <h1>👨‍🍳 Meal Queue</h1>
        <p>Manage and track meal preparations</p>
      </div>

      <div className="table-container">
        <table className="meal-queue-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.order_id}>
                  <td>#{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.plan}</td>
                  <td>
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                      className={`status-select ${order.order_status.toLowerCase()}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {order.order_status !== "Completed" && (
                        <button
                          className="complete-btn"
                          onClick={() => updateOrderStatus(order.order_id, "Completed")}
                          title="Mark as Completed"
                        >
                          ✅
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  <div className="empty-state">
                    <span>🍽️</span>
                    <p>No orders in the queue!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealQueue;
