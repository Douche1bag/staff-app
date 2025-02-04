import React, { useState } from "react";
import "./Customers.css"; // Ensure CSS file exists

const Customers = () => {
  // Sample customer data with multiple pets per customer
  const sampleCustomers = [
    { 
      customerid: "C001", 
      name: "Alice Johnson", 
      phone: "111-222-3333", 
      email: "alice@example.com", 
      address: "123 Main St, City",
      pets: ["P001", "P002"] // Multiple pet IDs
    },
    { 
      customerid: "C002", 
      name: "Bob Williams", 
      phone: "222-333-4444", 
      email: "bob@example.com", 
      address: "456 Elm St, Town",
      pets: ["P003"]
    },
    { 
      customerid: "C003", 
      name: "Charlie Brown", 
      phone: "333-444-5555", 
      email: "charlie@example.com", 
      address: "789 Pine St, Village",
      pets: ["P004", "P005", "P006"]
    },
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
  const editCustomer = (customerid) => {
    alert(`Edit customer ${customerid} (Feature coming soon!)`);
  };

  // Delete Customer
  const deleteCustomer = (customerid) => {
    setCustomers(customers.filter(cust => cust.customerid !== customerid));
  };

  return (
    <div className="content">
      <h1>🛒 Customer Management</h1>
      <p>View and manage customers and their pets.</p>

      {/* Customers Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Pet ID(s)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.customerid}>
              <td>{customer.customerid}</td>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.email}</td>
              <td>{customer.address}</td>
              <td>
                {customer.pets.join(", ")} {/* Display multiple Pet IDs */}
              </td>
              <td>
                <button className="edit-btn" onClick={() => editCustomer(customer.customerid)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteCustomer(customer.customerid)}>🗑️</button>
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
