import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";
import ProjectSelector from "../components/ProjectSelector";
import Filters from "../components/Filters";
import TaskStatsSummary from "../components/TaskStatsSummary";
import PriorityBreakdown from "../components/PriorityBreakdown";
import EmptyIcon from "../assets/icons/EmptyIcon";
import "../components/Dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showMyTasks, setShowMyTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [templateQuantity, setTemplateQuantity] = useState(1);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch projects
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

  // Fetch tasks for selected project
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

  // Fetch available templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/templates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTemplates(res.data);
        if (res.data.length > 0) {
          setSelectedTemplateId(res.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };
    fetchTemplates();
  }, [token]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleTaskUpdated = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  // Handle applying a selected template with a specified quantity.
  const handleApplyTemplate = async () => {
    if (!selectedTemplateId) return;
    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
    if (!selectedTemplate) return;
    const quantity = parseInt(templateQuantity, 10) || 1;
    const tasksToCreate = [];
    for (let i = 0; i < quantity; i++) {
      tasksToCreate.push({
        title: selectedTemplate.name,
        description: selectedTemplate.description,
        status: selectedTemplate.status,
        priority: selectedTemplate.priority,
        dueDate: selectedTemplate.dueDate,
        assigneeId: selectedTemplate.assigneeId,
        estimatedHours: selectedTemplate.estimatedHours,
        actualHours: selectedTemplate.actualHours,
        tags: selectedTemplate.tags,
        attachments: selectedTemplate.attachments,
        createdById: selectedTemplate.createdById,
        completedDate: selectedTemplate.completedDate,
        projectId: selectedProjectId,
      });
    }
    try {
      await axios.post(
        `/templates/${selectedTemplateId}/apply`,
        { projectId: selectedProjectId, tasks: tasksToCreate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Template applied and tasks created!");
      const res = await axios.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params: { projectId: selectedProjectId },
      });
      setTasks(res.data);
    } catch (error) {
      console.error("Error applying template:", error);
    }
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
      </div>

      <TaskStatsSummary taskStats={taskStats} />

      {/* Project Selection and Filters */}
      <div className="filter-strip">
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
      </div>

      <div className="dashboard-layout">
        <div className="sidebar">
          <div className="card">
            <h3>Add New Task</h3>
            <TaskForm
              projectId={selectedProjectId}
              onTaskAdded={handleAddTask}
            />
          </div>

          {/* Template Application Section */}
          <div className="card">
            <h3>Apply Template</h3>
            {templates.length > 0 ? (
              <div>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="form-control"
                >
                  {templates.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: "8px" }}>
                  <label>Number of Tasks to Create:</label>
                  <input
                    type="number"
                    min="1"
                    value={templateQuantity}
                    onChange={(e) => setTemplateQuantity(e.target.value)}
                    className="form-control"
                    style={{
                      width: "100px",
                      display: "inline-block",
                      marginLeft: "8px",
                    }}
                  />
                </div>
                <button
                  onClick={handleApplyTemplate}
                  className="btn"
                  style={{ marginTop: "8px" }}
                >
                  Apply Template
                </button>
              </div>
            ) : (
              <p>
                No templates available. Create some in the Templates section.
              </p>
            )}
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
              <TaskTable
                tasks={filteredTasks}
                onTaskUpdated={handleTaskUpdated}
              />
            ) : (
              <div className="empty-state">
                <EmptyIcon className="empty-icon" />
                <p className="empty-text">
                  No tasks found with the current filters.
                </p>
              </div>
            )}
          </div>

          <PriorityBreakdown taskStats={taskStats} totalTasks={tasks.length} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
