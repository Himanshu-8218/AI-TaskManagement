import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function Insights({ tasks }) {
  // Extracting counts by status
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { not_started: 0, in_progress: 0, completed: 0 }
  );

  // Extracting counts by type
  const typeCounts = tasks.reduce(
    (acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    },
    { personal: 0, weekend: 0, official: 0 }
  );

  // Chart data
  const statusData = {
    labels: ["Not Started", "In Progress", "completed"],
    datasets: [
      {
        label: "Task Status",
        data: [
          statusCounts.not_started,
          statusCounts.in_progress,
          statusCounts.completed,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#4bc0c0"],
      },
    ],
  };

  const typeData = {
    labels: ["personal", "Weekend", "Official"],
    datasets: [
      {
        label: "Task Type",
        data: [typeCounts.personal, typeCounts.weekend, typeCounts.official],
        backgroundColor: ["#ff9f40", "#9966ff", "#ffcd56"],
      },
    ],
  };

  return (
    <div >
      <h2 style={{display:"flex",position:"fixed",top:"3.5rem",left:"48%",fontWeight:"1000",color:"black"}}>INSIGHTS</h2>
      <div className="insight" style={{display:"flex",justifyItems:"center",alignItems:"center"}}>
      <div style={{ width: "50%", margin: "auto" }}>
        <h3>Status Distribution</h3>
        <Bar data={statusData} />
      </div>
      <div style={{ width: "50%", margin: "auto" }}>
        <h3>Type Distribution</h3>
        <Pie data={typeData} />
        </div>
      </div>
    </div>
  );
}

export default Insights;
