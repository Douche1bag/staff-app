import React, { useState } from "react";

const Reports = () => {
  // Sample reported stock data (Simulating reports from Chefs)
  const [reports, setReports] = useState([
    { ingredient: "Chicken", quantity: 5, date: "2024-02-01" },
    { ingredient: "Carrots", quantity: 2, date: "2024-02-02" },
  ]);

  // Function to mark report as resolved
  const resolveReport = (ingredient) => {
    setReports(reports.filter(report => report.ingredient !== ingredient));
  };

  return (
    <div className="content">
      <h1>⚠️ Stock Reports</h1>
      <p>View ingredients reported as low by Chefs.</p>

      {/* Reported Stock Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Quantity Left</th>
            <th>Reported Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <tr key={index}>
                <td>{report.ingredient}</td>
                <td>{report.quantity} kg</td>
                <td>{report.date}</td>
                <td>
                  <button className="button resolve" onClick={() => resolveReport(report.ingredient)}>
                    ✅ Resolve
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">🎉 No reports! Stock is sufficient.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
