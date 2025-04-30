import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Container, Row, Col, Card } from "react-bootstrap";

function Insights({ tasks }) {
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { not_started: 0, in_progress: 0, completed: 0 }
  );

  const typeCounts = tasks.reduce(
    (acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    },
    { personal: 0, weekend: 0, official: 0 }
  );

  const statusData = {
    labels: ["Not Started", "In Progress", "Completed"],
    datasets: [
      {
        label: "Task Status",
        data: [
          statusCounts.not_started,
          statusCounts.in_progress,
          statusCounts.completed,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#4bc0c0"],
        borderColor: ["#ff6384", "#36a2eb", "#4bc0c0"],
        borderWidth: 1,
      },
    ],
  };

  const typeData = {
    labels: ["Personal", "Weekend", "Official"],
    datasets: [
      {
        label: "Task Type",
        data: [typeCounts.personal, typeCounts.weekend, typeCounts.official],
        backgroundColor: ["#ff9f40", "#9966ff", "#ffcd56"],
        borderColor: ["#ff9f40", "#9966ff", "#ffcd56"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">Task Insights</h1>
        <p className="text-muted">Visual overview of your tasks by status and type</p>
      </div>
    <Container className="my-5">
      {/* Separate Heading */}

      {/* Charts Row */}
      <Row className="justify-content-center">
        <Col md={6} className="mb-4 d-flex justify-content-center">
          <Card className="shadow w-100" style={{ maxWidth: "500px" }}>
            <Card.Body>
              <h5 className="text-center text-secondary mb-3">Task Status Distribution</h5>
              <Bar
                data={statusData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: "top" },
                    tooltip: { enabled: true },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4 d-flex justify-content-center">
          <Card className="shadow w-100" style={{ maxWidth: "500px" }}>
            <Card.Body>
              <h5 className="text-center text-secondary mb-3">Task Type Distribution</h5>
              <Pie
                data={typeData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: "top" },
                    tooltip: { enabled: true },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default Insights;
