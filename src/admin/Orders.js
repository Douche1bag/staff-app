import React, { useState } from "react";
import "./Orders.css"; // Ensure you have this file for styling

const Orders = () => {
  // Sample order data (Replace with API data)
  const sampleOrders = [
    { id: "0001", plan: "7 Day", customerid: "C001", petids: "P001", date: "2022-05-13", amount: 12, Menu: "Menu1, Menu2", status: "Delivered" },
    { id: "0002", plan: "14 Day", customerid: "C001", petids: "P002", date: "2022-05-22", amount: 3, Menu: "Menu2, Menu4", status: "Delivered" },
    { id: "0003", plan: "7 Day", customerid: "C002", petids: "P004", date: "2022-06-15", amount: 5, Menu: "Menu3", status: "Process" },
    { id: "0004", plan: "28 Day", customerid: "C002", petids: "P005", date: "2022-09-06", amount: 7, Menu: "Menu1, Menu5", status: "Process" },
    { id: "0005", plan: "7 Day", customerid: "C002", petids: "P006", date: "2022-09-25", amount: 9, Menu: "Menu2", status: "Canceled" },
    { id: "0006", plan: "14 Day", customerid: "C006", petids: "P008", date: "2022-10-04", amount: 11, Menu: "Menu3", status: "Delivered" },
    { id: "0007", plan: "14 Day", customerid: "C007", petids: "P010", date: "2022-10-17", amount: 6, Menu: "Menu3, Menu2", status: "Delivered" },
    { id: "0008", plan: "28 Day", customerid: "C008", petids: "P011", date: "2022-10-24", amount: 5, Menu: "Menu1, Menu4", status: "Delivered" },
    { id: "0009", plan: "28 Day", customerid: "C009", petids: "P014", date: "2022-11-01", amount: 4, Menu: "Menu1, Menu2", status: "Canceled" },
    { id: "0010", plan: "14 Day", customerid: "C010", petids: "P015", date: "2022-11-22", amount: 3, Menu: "Menu3, Menu4", status: "Process" },
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
            <th>Order ID</th>
            <th>Plan</th>
            <th>Customer ID</th>
            <th>Pet ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Menu</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.plan}</td>
              <td>{order.customerid}</td>
              <td>{order.petids}</td>
              <td>{order.date}</td>
              <td>{order.amount}</td>
              <td>{order.Menu}</td>
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
