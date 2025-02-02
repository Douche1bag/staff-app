import React, { useState } from "react";

const Employees = () => {
  // Sample employee data (Replace with API data if needed)
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", role: "Chef", phone: "012-345-6789" },
    { id: 2, name: "Jane Smith", role: "Manager", phone: "098-765-4321" }
  ]);

  // State for new employee input
  const [newEmployee, setNewEmployee] = useState({ name: "", role: "", phone: "" });

  // Handle input change
  const handleInputChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  // Add new employee
  const addEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.phone) {
      setEmployees([...employees, { id: employees.length + 1, ...newEmployee }]);
      setNewEmployee({ name: "", role: "", phone: "" }); // Clear input fields
    }
  };

  // Delete an employee
  const deleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <div className="content">
      <h1>👥 Employee Management</h1>
      <p>Manage staff details here.</p>

      {/* Employee Table */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.phone}</td>
              <td>
                <button className="button delete" onClick={() => deleteEmployee(employee.id)}>❌ Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Employee Form */}
      <div className="employee-form">
        <h3>Add New Employee</h3>
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={newEmployee.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="role"
          placeholder="Role (Chef, Manager, etc.)"
          value={newEmployee.role}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={newEmployee.phone}
          onChange={handleInputChange}
        />
        <button className="button" onClick={addEmployee}>➕ Add Employee</button>
      </div>
    </div>
  );
};

export default Employees;
