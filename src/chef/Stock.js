import React, { useState } from "react";

const Stock = () => {
  // Sample stock data (Replace with API data if needed)
  const [stock, setStock] = useState([
    { id: 1, ingredient: "Chicken", quantity: 5, reported: false },
    { id: 2, ingredient: "Rice", quantity: 30, reported: false },
    { id: 3, ingredient: "Carrots", quantity: 2, reported: false },
  ]);

  // Function to report low stock to admin
  const reportToAdmin = (id) => {
    setStock(stock.map(item => (item.id === id ? { ...item, reported: true } : item)));
    alert("Stock reported to Admin!"); // Simulating notification
  };

  return (
    <div className="content">
      <h1>📊 Stock Overview</h1>
      <p>Chefs can view stock levels and report low inventory to Admin.</p>

      {/* Stock Table */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ingredient</th>
            <th>Quantity</th>
            <th>Report</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.ingredient}</td>
              <td>{item.quantity} kg</td>
              <td>
                {item.reported ? (
                  <span className="reported">✅ Reported</span>
                ) : (
                  <button className="button report" onClick={() => reportToAdmin(item.id)}>
                    ⚠️ Report Low Stock
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
