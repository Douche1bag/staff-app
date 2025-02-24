import React, { useEffect, useState } from "react";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Fetch Customers & Their Pets from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        console.log('Fetching customers...'); // Debug log
        const response = await fetch("http://localhost:3000/api/customers");
        console.log('Response:', response); // Debug log

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers: " + err.message);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Debug logs
  console.log('Current state:', { 
    customers, 
    loading, 
    error, 
    currentPage 
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to delete customer
  const deleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete customer');
        }

        setCustomers(customers.filter((cust) => cust.customer_id !== customerId));
      } catch (err) {
        console.error("Error deleting customer:", err);
        alert("Failed to delete customer");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="customers-container">
      <div className="customers-header">
        <h1>🛒 Customer Management</h1>
        <p>View and manage customers and their pets.</p>
      </div>

      {/* Customers Table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Pet ID(s)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.mobile_no}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address}</td>
                  <td>
                    {customer.pets ? customer.pets.join(", ") : "No Pets"}
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteCustomer(customer.customer_id)}
                      title="Delete Customer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {customers.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(Math.ceil(customers.length / customersPerPage))].map((_, index) => (
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
            disabled={currentPage === Math.ceil(customers.length / customersPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Customers;

