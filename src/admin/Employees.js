import React, { useState } from "react";
import "./Employees.css"; // Ensure CSS file is created

const Employees = () => {
  // Sample employee data (Replace with API data)
  const sampleEmployees = [
    { id: "E001", name: "John Doe", role: "Chef", phone: "123-456-7890", email: "john@example.com" },
    { id: "E002", name: "Jane Smith", role: "Manager", phone: "987-654-3210", email: "jane@example.com" },
    { id: "E003", name: "Tom Johnson", role: "Waiter", phone: "456-789-1234", email: "tom@example.com" },
    { id: "E004", name: "Alice Brown", role: "Cashier", phone: "654-321-9876", email: "alice@example.com" },
  ];

  const [employees, setEmployees] = useState(sampleEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 3;

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Edit Employee (Dummy function)
  const editEmployee = (id) => {
    alert(`Edit employee ${id} (Feature coming soon!)`);
  };

  // Delete Employee
  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <div className="content">
      <h1>👥 Employee Management</h1>
      <p>View and manage employees.</p>

      {/* Employees Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.phone}</td>
              <td>{employee.email}</td>
              <td>
                <button className="edit-btn" onClick={() => editEmployee(employee.id)}>✏️</button>
                <button className="delete-btn" onClick={() => deleteEmployee(employee.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        {[...Array(Math.ceil(employees.length / employeesPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}>
            {number + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(employees.length / employeesPerPage)}>Next</button>
      </div>
    </div>
  );
};

export default Employees;
