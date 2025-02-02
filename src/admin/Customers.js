import React, { useState } from "react";
import "./Customers.css"; // Ensure CSS file is created

const Customers = () => {
  // Sample customer data (Replace with API data)
  const sampleCustomers = [
    { id: "C001", name: "Alice Johnson", phone: "111-222-3333", email: "alice@example.com", address: "123 Main St, City" },
    { id: "C002", name: "Bob Williams", phone: "222-333-4444", email: "bob@example.com", address: "456 Elm St, Town" },
    { id: "C003", name: "Charlie Brown", phone: "333-444-5555", email: "charlie@example.com", address: "789 Pine St, Village" },
  ];

  const [customers, setCustomers] = useState(sampleCustomers);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 3;

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Edit Customer (Dummy function)
  const editCustomer = (id) => {
    alert(`Edit customer ${id} (Feature coming soon!)`);
  };

  // Delete Customer
  const deleteCustomer = (id) => {
    setCustomers(customers.filter(cust => cust.id !== id));
  };

  return (
    <div className="content">
      <h1>🛒 Customer Management</h1>
      <p>View and manage customers.</p>

      {/* Customers Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
              <td>{customer.address}</td>
              <td>
                <button className="edit-btn" onClick={() => editCustomer(customer.id)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteCustomer(customer.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        {[...Array(Math.ceil(customers.length / customersPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}>
            {number + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(customers.length / customersPerPage)}>Next</button>
      </div>
    </div>
  );
};

export default Customers;
