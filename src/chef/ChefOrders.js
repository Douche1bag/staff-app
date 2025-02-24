import React, { useEffect, useState } from "react";
import "./ChefOrders.css";

const ChefOrders = () => {
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

  const updateOrderDate = async (orderId, field, value) => {
    try {
      const response = await fetch(`http://localhost:3000/api/chef/orders/${orderId}/dates`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) throw new Error('Failed to update order dates');
      
      setOrders(orders.map(order => 
        order.order_id === orderId 
          ? { ...order, [field]: value }
          : order
      ));
    } catch (err) {
      console.error("Error updating order dates:", err);
      alert("Failed to update order dates");
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="content">
      <div className="chef-orders-header">
        <h1>👨‍🍳 Order Management</h1>
        <p>Set made and expiry dates for orders</p>
      </div>

      <div className="table-container">
        <table className="chef-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Plan</th>
              <th>Made Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
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
                    <input
                      type="date"
                      value={order.made_date || ''}
                      onChange={(e) => updateOrderDate(order.order_id, "made_date", e.target.value)}
                      disabled={order.order_status === "Completed"}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={order.expiry_date || ''}
                      onChange={(e) => updateOrderDate(order.order_id, "expiry_date", e.target.value)}
                      disabled={order.order_status === "Completed"}
                    />
                  </td>
                  <td>
                    <span className={`status-badge ${order.order_status.toLowerCase()}`}>
                      {order.order_status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChefOrders;
