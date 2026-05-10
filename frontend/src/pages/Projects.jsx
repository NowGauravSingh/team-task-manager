import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import "../styles/project.css";

function Projects() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: ""
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    project: "",
    priority: "medium",
    dueDate: ""
  });

  const fetchData = async () => {
    const projectRes = await API.get("/projects");
    const taskRes = await API.get("/tasks");

    setProjects(projectRes.data);
    setTasks(taskRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createProject = async (e) => {
    e.preventDefault();

    if (!projectForm.name) return alert("Project name is required");

    await API.post("/projects", projectForm);

    setProjectForm({
      name: "",
      description: ""
    });

    fetchData();
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title || !taskForm.project || !taskForm.dueDate) {
      return alert("Title, project and due date are required");
    }

    await API.post("/tasks", taskForm);

    setTaskForm({
      title: "",
      description: "",
      project: "",
      priority: "medium",
      dueDate: ""
    });

    fetchData();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchData();
  };

  return (
    <>
      <Navbar />

      <div className="container projects-page">
        <h1>Projects & Tasks</h1>
        <p className="subtitle">Create projects, assign work and track progress</p>

        {user?.role === "admin" && (
          <div className="forms-grid">
            <form className="form-card" onSubmit={createProject}>
              <h2>Create Project</h2>

              <input
                type="text"
                placeholder="Project name"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    name: e.target.value
                  })
                }
              />

              <textarea
                placeholder="Project description"
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    description: e.target.value
                  })
                }
              />

              <button className="btn btn-primary">Create Project</button>
            </form>

            <form className="form-card" onSubmit={createTask}>
              <h2>Create Task</h2>

              <input
                type="text"
                placeholder="Task title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    title: e.target.value
                  })
                }
              />

              <textarea
                placeholder="Task description"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    description: e.target.value
                  })
                }
              />

              <select
                value={taskForm.project}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    project: e.target.value
                  })
                }
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={taskForm.priority}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    priority: e.target.value
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    dueDate: e.target.value
                  })
                }
              />

              <button className="btn btn-primary">Create Task</button>
            </form>
          </div>
        )}

        <h2 className="section-title">All Projects</h2>

        <div className="project-grid">
          {projects.length === 0 ? (
            <div className="empty">No projects found</div>
          ) : (
            projects.map((project) => (
              <div className="project-card" key={project._id}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <small>Owner: {project.owner?.name || "Admin"}</small>
              </div>
            ))
          )}
        </div>

        <h2 className="section-title">All Tasks</h2>

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
                    {new Date(task.dueDate).toLocaleDateString()}
                  </small>
                </div>

                <div className="task-actions">
                  <span className={`badge ${task.status}`}>{task.status}</span>

                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Projects;