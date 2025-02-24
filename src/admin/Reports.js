import React, { useEffect, useState } from "react";
import "./Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/stock-reports");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports: " + err.message);
      setLoading(false);
    }
  };

  const solveReport = async (reportId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/stock-reports/${reportId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error('Failed to solve report');
      
      // Remove the solved report from the state
      setReports(reports.filter(report => report.report_id !== reportId));
      setSuccess("Report marked as solved successfully!");
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Error solving report:", err);
      setError("Failed to solve report: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading reports...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="content">
      <div className="report-header">
        <h1>⚠️ Stock Reports</h1>
        <p>View and manage low stock reports from kitchen staff</p>
      </div>

      {success && <div className="success-message">{success}</div>}

      <div className="table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reported Date</th>
              <th>Reported By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.report_id}>
                  <td>#{report.report_id}</td>
                  <td>{formatDate(report.reported_date)}</td>
                  <td>{report.reported_by}</td>
                  <td>
                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    {report.status === 'Pending' && (
                      <button
                        onClick={() => solveReport(report.report_id)}
                        className="solve-btn"
                        title="Mark as solved"
                      >
                        ✅ Solve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  <div className="empty-state">
                    <span>🎉</span>
                    <p>No pending reports!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
