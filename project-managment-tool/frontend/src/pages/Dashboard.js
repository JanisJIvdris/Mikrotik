import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
        if (res.data.length > 0) {
          setSelectedProjectId(res.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [token]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
          params: { projectId: selectedProjectId },
        });
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (selectedProjectId) {
      fetchTasks();
    }
  }, [token, selectedProjectId]);

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ marginRight: "8px" }}>Select Project:</label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <TaskForm
        projectId={selectedProjectId}
        onTaskCreated={(newTask) => setTasks([...tasks, newTask])}
      />
      <h3>Tasks:</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.status} - {task.priority}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
