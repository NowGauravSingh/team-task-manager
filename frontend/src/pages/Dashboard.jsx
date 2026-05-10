import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const statsRes = await API.get("/tasks/dashboard/stats");
      const tasksRes = await API.get("/tasks");

      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading dashboard...</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="container dashboard">
        <h1>Dashboard</h1>
        <p className="subtitle">Track project tasks and team progress</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card success">
            <h3>{stats?.completedTasks || 0}</h3>
            <p>Completed</p>
          </div>

          <div className="stat-card warning">
            <h3>{stats?.pendingTasks || 0}</h3>
            <p>Pending</p>
          </div>

          <div className="stat-card danger">
            <h3>{stats?.overdueTasks || 0}</h3>
            <p>Overdue</p>
          </div>
        </div>

        <div className="section-header">
          <h2>Recent Tasks</h2>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty">No tasks found</div>
          ) : (
            tasks.map((task) => (
              <div className="task-row" key={task._id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <small>
                    Project: {task.project?.name || "N/A"} | Due:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </small>
                </div>

                <div className="task-meta">
                  <span className={`badge ${task.status}`}>
                    {task.status}
                  </span>
                  <span className={`priority ${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;