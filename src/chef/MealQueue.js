import React from "react";

const MealQueue = () => {
  return (
    <div className="content">
      <h1>🍽️ Meal Queue</h1>
      <p>List of meals to be prepared.</p>

      <table className="table">
        <thead>
          <tr>
            <th>Meal ID</th>
            <th>Meal Name</th>
            <th>Order Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>001</td>
            <td>Chicken Rice</td>
            <td>12:30 PM</td>
            <td>Pending</td>
          </tr>
          <tr>
            <td>002</td>
            <td>Beef Bowl</td>
            <td>12:45 PM</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MealQueue;
