import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/dashboardservice";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getDashboard();
        setData(res);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="projects-page">
      <div className="dashboard-header">
        <h1 className="title">Dashboard</h1>
        <button className="add-task-btn" onClick={() => navigate("/projects")}>
          View Projects
        </button>
      </div>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <div className="dashboard-stats">
            <div className="dashboard-card">
              <h3>Total Projects</h3>
              <p>{data.totalProjects}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Tasks</h3>
              <p>{data.totalTasks}</p>
            </div>

            <div className="dashboard-card overdue-card">
              <h3>Overdue Tasks</h3>
              <p>{data.overdueCount}</p>
            </div>
          </div>

          <div className="dashboard-status">
            <div className="dashboard-card">
              <h3>Tasks by Status</h3>
              <div className="status-list">
                <span>Todo: {data.tasksByStatus?.todo || 0}</span>
                <span>In Progress: {data.tasksByStatus?.inProgress || 0}</span>
                <span>Review: {data.tasksByStatus?.review || 0}</span>
                <span>Done: {data.tasksByStatus?.done || 0}</span>
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Due Within 7 Days</h3>
              {data.dueWithin7Days?.length ? (
                <div className="due-list">
                  {data.dueWithin7Days.map((task) => (
                    <div key={task.id} className="due-item">
                      <strong>{task.title}</strong>
                      <span>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upcoming tasks</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
