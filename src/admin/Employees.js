import React, { useEffect, useState } from "react";
import "./Employees.css"; // Ensure you have this CSS file

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    mobile_no: '',
    email: '',
    password: '' // Added for new employees
  });

  const employeesPerPage = 5;

  // Fetch Employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees: " + err.message);
      setLoading(false);
    }
  };

  // Add new employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error('Failed to add employee');
      
      await fetchEmployees(); // Refresh the list
      setNewEmployee({ name: '', role: '', mobile_no: '', email: '', password: '' }); // Reset form
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Failed to add employee");
    }
  };

  // Update employee email
  const handleUpdateEmail = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: editingEmployee.email }),
      });

      if (!response.ok) throw new Error('Failed to update email');
      
      await fetchEmployees(); // Refresh the list
      setEditingEmployee(null); // Exit edit mode
    } catch (err) {
      console.error("Error updating email:", err);
      alert("Failed to update email");
    }
  };

  // Delete employee
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/employees/${employeeId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) throw new Error('Failed to delete employee');
        
        await fetchEmployees(); // Refresh the list
      } catch (err) {
        console.error("Error deleting employee:", err);
        alert("Failed to delete employee");
      }
    }
  };

  // Pagination logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading employees...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1>👥 Employee Management</h1>
        <p>View and manage employees.</p>
      </div>

      {/* Add New Employee Form */}
      <div className="add-employee-form">
        <h2>Add New Employee</h2>
        <form onSubmit={handleAddEmployee}>
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
            required
          />
          <select
            value={newEmployee.role}
            onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Cook">Cook</option>
          </select>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={newEmployee.mobile_no}
            onChange={(e) => setNewEmployee({...newEmployee, mobile_no: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newEmployee.password}
            onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
            required
          />
          <button type="submit">Add Employee</button>
        </form>
      </div>

      {/* Employees Table */}
      <div className="table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <tr key={employee.employee_id}>
                <td>{employee.employee_id}</td>
                <td>{employee.name}</td>
                <td>{employee.role}</td>
                <td>{employee.mobile_no}</td>
                <td>
                  {editingEmployee?.employee_id === employee.employee_id ? (
                    <input
                      type="email"
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        email: e.target.value
                      })}
                    />
                  ) : (
                    employee.email
                  )}
                </td>
                <td>
                  {editingEmployee?.employee_id === employee.employee_id ? (
                    <button 
                      className="save-btn"
                      onClick={() => handleUpdateEmail(employee.employee_id)}
                    >
                      💾
                    </button>
                  ) : (
                    <button 
                      className="edit-btn"
                      onClick={() => setEditingEmployee(employee)}
                    >
                      ✏️
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteEmployee(employee.employee_id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {employees.length > employeesPerPage && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(Math.ceil(employees.length / employeesPerPage))].map((_, index) => (
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
            disabled={currentPage === Math.ceil(employees.length / employeesPerPage)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Employees;

