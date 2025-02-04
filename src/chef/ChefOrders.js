import React, { useState } from "react";
import "./ChefOrders.css"; // Ensure the CSS file exists

const ChefOrders = () => {
  // Sample order data (Replace with API data if needed)
  const [orders, setOrders] = useState([
    { id: 1, customer: "Alice Johnson", menu: "Chicken Rice", madeOn: "2024-01-30", expiry: "2024-02-05", status: "Preparing" },
    { id: 2, customer: "Bob Williams", menu: "Beef Bowl", madeOn: "2024-01-31", expiry: "2024-02-07", status: "Preparing" },
  ]);

  // Update order dates
  const updateOrderDate = (id, field, value) => {
    setOrders(orders.map(order => 
      order.id === id && order.status !== "Completed" ? { ...order, [field]: value } : order
    ));
  };

  // Mark order as "Completed"
  const completeOrder = (id) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: "Completed" } : order
    ));
  };

  // Sort orders by Made Date
  const sortedOrders = [...orders].sort((a, b) => new Date(a.madeOn) - new Date(b.madeOn));

  return (
    <div className="content">
      <h1>🍽️ Chef Order Management</h1>
      <p>View, edit order dates, and mark orders as completed.</p>

      {/* Order Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Menu</th>
            <th>Made On</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.menu}</td>
              <td>
                <input
                  type="date"
                  value={order.madeOn}
                  onChange={(e) => updateOrderDate(order.id, "madeOn", e.target.value)}
                  disabled={order.status === "Completed"}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={order.expiry}
                  onChange={(e) => updateOrderDate(order.id, "expiry", e.target.value)}
                  disabled={order.status === "Completed"}
                />
              </td>
              <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
              <td>
                {order.status !== "Completed" ? (
                  <button className="complete-btn" onClick={() => completeOrder(order.id)}>
                    ✅ Complete
                  </button>
                ) : (
                  <span className="completed-text">✔️ Done</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChefOrders;
