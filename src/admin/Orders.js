import React, { useEffect, useState } from "react";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Fetch Orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/orders");
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

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      // Update local state
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

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) throw new Error('Failed to delete order');
        
        setOrders(orders.filter(order => order.order_id !== orderId));
      } catch (err) {
        console.error("Error deleting order:", err);
        alert("Failed to delete order");
      }
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper function to format price
  const formatPrice = (price) => {
    try {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return `$${numPrice.toFixed(2)}`;
    } catch (err) {
      console.error('Error formatting price:', err);
      return `$${price}`; // Fallback to display original price
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>📦 Order Management</h1>
        <p>View and manage all customer orders.</p>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Plan</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Date</th>
              <th>Cook</th>
              <th>Admin</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.plan}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.quantity}</td>
                  <td>{formatPrice(order.price)}</td>
                  <td>{new Date(order.date_order).toLocaleDateString()}</td>
                  <td>{order.cook_name || 'Not assigned'}</td>
                  <td>{order.admin_name || 'Not assigned'}</td>
                  <td>
                    <select
                      value={order.order_status}
                      onChange={(e) => handleStatusUpdate(order.order_id, e.target.value)}
                      className={`status-select ${order.order_status.toLowerCase()}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteOrder(order.order_id)}
                      title="Delete Order"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {orders.length > ordersPerPage && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(Math.ceil(orders.length / ordersPerPage))].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
