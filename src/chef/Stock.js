import React, { useEffect, useState } from "react";
import "./Stock.css";

const Stock = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [reportedIngredients, setReportedIngredients] = useState([]); // Track reported ingredients
  const ingredientsPerPage = 5; // Adjust how many ingredients to show per page

  useEffect(() => {
    fetchIngredients();
    // Load any previously reported ingredients from localStorage
    const savedReported = localStorage.getItem('reportedIngredients');
    if (savedReported) {
      setReportedIngredients(JSON.parse(savedReported));
    }
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/chef/ingredients");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setIngredients(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching ingredients:", err);
      setError("Failed to load ingredients: " + err.message);
      setLoading(false);
    }
  };

  const reportLowStock = async (ingredientId, ingredientName) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user')).employee_id;
      const response = await fetch("http://localhost:3000/api/chef/stock-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_reporter_id: userId,
          ingredient_id: ingredientId,
          description: `Low stock report for ${ingredientName}`,
          status: 'Pending'
        }),
      });

      if (!response.ok) throw new Error('Failed to submit report');
      
      // Add the reported ingredient to the reportedIngredients state
      const updatedReported = [...reportedIngredients, ingredientId];
      setReportedIngredients(updatedReported);
      
      // Save to localStorage for persistence
      localStorage.setItem('reportedIngredients', JSON.stringify(updatedReported));
      
      setSuccess(`Successfully reported low stock for ${ingredientName}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Error reporting low stock:", err);
      setError("Failed to report low stock: " + err.message);
    }
  };

  const getStockStatus = (amount) => {
    if (amount <= 15) return "critical";
    if (amount <= 25) return "low";
    return "good";
  };

  // Pagination logic
  const indexOfLastIngredient = currentPage * ingredientsPerPage;
  const indexOfFirstIngredient = indexOfLastIngredient - ingredientsPerPage;
  const currentIngredients = ingredients.slice(indexOfFirstIngredient, indexOfLastIngredient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading ingredients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="content">
      <div className="stock-header">
        <h1>📦 Kitchen Ingredients Stock</h1>
        <p>Monitor ingredient levels and report low stock</p>
      </div>

      {success && <div className="success-message">{success}</div>}

      <div className="table-container">
        <table className="ingredients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ingredient</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentIngredients.map((ingredient) => {
              const status = getStockStatus(ingredient.amount);
              const isReported = reportedIngredients.includes(ingredient.ingredient_id);
              
              return (
                <tr key={ingredient.ingredient_id} className={status}>
                  <td>#{ingredient.ingredient_id}</td>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.amount}</td>
                  <td>
                    <span className={`status-badge ${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="description-cell">{ingredient.description}</td>
                  <td>
                    {isReported ? (
                      <span className="already-reported">Already Reported</span>
                    ) : (
                      <button
                        onClick={() => reportLowStock(ingredient.ingredient_id, ingredient.name)}
                        className="report-btn"
                        disabled={status === "good"}
                        title={status === "good" ? "Stock level is good" : "Report low stock"}
                      >
                        Report Low Stock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        {[...Array(Math.ceil(ingredients.length / ingredientsPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)} 
            className={currentPage === number + 1 ? "active" : ""}>
            {number + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === Math.ceil(ingredients.length / ingredientsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Stock;