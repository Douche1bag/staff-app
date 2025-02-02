import React, { useState } from "react";
import "./Orders.css"; // Ensure you have this file for styling

const Orders = () => {
  // Sample order data (Replace with API data)
  const sampleOrders = [
    { id: "0001", product: "Menu1", customer: "Matt Dickerson", date: "2022-05-13", amount: 12, payment: "Transfer Bank", status: "Delivered" },
    { id: "0002", product: "Menu2", customer: "Wiktoria", date: "2022-05-22", amount: 3, payment: "Cash on Delivery", status: "Delivered" },
    { id: "0003", product: "Menu2", customer: "Trixie Byrd", date: "2022-06-15", amount: 5, payment: "Cash on Delivery", status: "Process" },
    { id: "0004", product: "Menu4", customer: "Brad Mason", date: "2022-09-06", amount: 7, payment: "Transfer Bank", status: "Process" },
    { id: "0005", product: "Menu3", customer: "Sanderson", date: "2022-09-25", amount: 9, payment: "Cash on Delivery", status: "Canceled" },
    { id: "0006", product: "Menu1", customer: "Jun Redfern", date: "2022-10-04", amount: 11, payment: "Transfer Bank", status: "Delivered" },
    { id: "0007", product: "Menu3", customer: "Miriam Kidd", date: "2022-10-17", amount: 6, payment: "Transfer Bank", status: "Delivered" },
    { id: "0008", product: "Menu2", customer: "Dominic", date: "2022-10-24", amount: 5, payment: "Cash on Delivery", status: "Delivered" },
    { id: "0009", product: "Menu1", customer: "Shanice", date: "2022-11-01", amount: 4, payment: "Transfer Bank", status: "Canceled" },
    { id: "0010", product: "Menu3", customer: "Peppa-Pig", date: "2022-11-22", amount: 3, payment: "Transfer Bank", status: "Process" },
  ];

  const [orders, setOrders] = useState(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Edit Order (Dummy function)
  const editOrder = (id) => {
    alert(`Edit order ${id} (Feature coming soon!)`);
  };

  // Delete Order
  const deleteOrder = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <div className="content">
      <h1>📦 Order Management</h1>
      <p>View and manage all customer orders.</p>

      {/* Orders Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Tracking ID</th>
            <th>Product</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Payment Mode</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product}</td>
              <td>{order.customer}</td>
              <td>{order.date}</td>
              <td>{order.amount}</td>
              <td>{order.payment}</td>
              <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
              <td>
                <button className="edit-btn" onClick={() => editOrder(order.id)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteOrder(order.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}>
            {number + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
