import React, { useState } from "react";

const Customers = () => {
  // Sample customer data (Replace with API data if needed)
  const [customers, setCustomers] = useState([
    { id: 101, name: "Alice Johnson", email: "alice@example.com", phone: "012-345-6789", address: "123 Main St, NY" },
    { id: 102, name: "Bob Williams", email: "bob@example.com", phone: "098-765-4321", address: "456 Elm St, CA" }
  ]);

  // State for new customer input
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", address: "" });

  // Handle input change
  const handleInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  // Add new customer
  const addCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone && newCustomer.address) {
      setCustomers([...customers, { id: customers.length + 101, ...newCustomer }]);
      setNewCustomer({ name: "", email: "", phone: "", address: "" }); // Clear input fields
    }
  };

  // Delete a customer
  const deleteCustomer = (id) => {
    setCustomers(customers.filter(customer => customer.id !== id));
  };

  // Edit customer (For future improvements)
  const editCustomer = (id) => {
    alert(`Editing customer with ID: ${id}`); // Replace with edit functionality
  };

  return (
    <div className="content">
      <h1>🛒 Customer Management</h1>
      <p>View and manage customer details here.</p>

      {/* Customer Table */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <button className="button edit" onClick={() => editCustomer(customer.id)}>✏️ Edit</button>
                <button className="button delete" onClick={() => deleteCustomer(customer.id)}>❌ Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Customer Form */}
      <div className="customer-form">
        <h3>Add New Customer</h3>
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={newCustomer.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={newCustomer.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={newCustomer.phone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newCustomer.address}
          onChange={handleInputChange}
        />
        <button className="button" onClick={addCustomer}>➕ Add Customer</button>
      </div>
    </div>
  );
};

export default Customers;
