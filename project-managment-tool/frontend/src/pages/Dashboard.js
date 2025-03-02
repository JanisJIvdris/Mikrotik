import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import ProjectSelector from "../components/ProjectSelector";
import Filters from "../components/Filters";
import TaskStatsSummary from "../components/TaskStatsSummary";
import PriorityBreakdown from "../components/PriorityBreakdown";
import "../components/Dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedProjectId) return;

      setIsLoading(true);
      try {
        const params = { projectId: selectedProjectId };
        if (showMyTasks && userId) {
          params.assigneeId = userId;
        }

        const res = await axios.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [token, selectedProjectId, showMyTasks, userId]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter)
      return false;
    return true;
  });

  // Calculate task statistics
  const taskStats = {
    new: tasks.filter((t) => t.status === "new").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    critical: tasks.filter((t) => t.priority === "critical").length,
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
    overdue: tasks.filter(
      (t) => new Date(t.dueDate) < new Date() && t.status !== "completed"
    ).length,
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2 className="header-title">Dashboard</h2>
        <button>New Project</button>
      </div>

      <TaskStatsSummary taskStats={taskStats} />

      <div className="dashboard-layout">
        <div className="sidebar">
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
          />

          <Filters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            showMyTasks={showMyTasks}
            setShowMyTasks={setShowMyTasks}
          />

          <div className="card">
            <h3>Add New Task</h3>
            <TaskForm
              projectId={selectedProjectId}
              onTaskAdded={handleAddTask}
            />
          </div>
        </div>

        <div className="main-content">
          <div className="card">
            <div className="task-header">
              <div>
                <h3 style={{ marginBottom: "4px" }}>Tasks</h3>
                <p className="task-status">
                  {showMyTasks
                    ? "Showing your assigned tasks"
                    : "Showing all tasks"}
                  {statusFilter !== "all" && ` with status "${statusFilter}"`}
                  {priorityFilter !== "all" &&
                    ` and priority "${priorityFilter}"`}
                </p>
              </div>
              <div className="task-counter">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </div>
            </div>

            {isLoading ? (
              <div className="empty-state">
                <div className="spinner"></div>
              </div>
            ) : filteredTasks.length > 0 ? (
              <TaskTable tasks={filteredTasks} />
            ) : (
              <EmptyState />
            )}
          </div>

          <PriorityBreakdown taskStats={taskStats} totalTasks={tasks.length} />
        </div>
      </div>
    </div>
  );
}

const EmptyState = () => (
  <div className="empty-state">
    <svg
      className="empty-icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
    <p className="empty-text">No tasks found with the current filters.</p>
    <button>Create a new task</button>
  </div>
);

export default Dashboard;
