import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskTable.css";

function TaskTable({ tasks, onTaskUpdated }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    assigneeId: "",
    projectId: "",
    estimatedHours: "",
    tags: "",
    attachments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New state for registered users
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userFetchError, setUserFetchError] = useState(null);

  const pageSize = 10;
  const totalPages = Math.ceil(tasks.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentTasks = tasks.slice(startIndex, startIndex + pageSize);
  const token = localStorage.getItem("token");

  // Fetch registered users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setUserFetchError(null);
      try {
        const res = await axios.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          setUserFetchError("Received unexpected user data format.");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUserFetchError(`Failed to fetch users: ${err.message}`);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    if (token) {
      fetchUsers();
    } else {
      setIsLoadingUsers(false);
    }
  }, [token]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setEditingTaskId(null);
    setSelectedTaskId(null);
    setDeleteConfirmationId(null);
  };

  const selectTask = (taskId, e) => {
    if (editingTaskId === null && !e.target.closest(".action-btn")) {
      setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
      setDeleteConfirmationId(null);
    }
  };

  const startEditing = (task, e) => {
    if (e) e.stopPropagation();
    setEditingTaskId(task.id);
    setSelectedTaskId(null);
    setDeleteConfirmationId(null);
    setEditFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "new",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      assigneeId: task.assigneeId ? String(task.assigneeId) : "",
      projectId: task.projectId || "",
      estimatedHours: task.estimatedHours || "",
      tags: task.tags || "",
      attachments: task.attachments || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const updateData = { ...editFormData };
      if (updateData.assigneeId === "") updateData.assigneeId = null;
      if (updateData.projectId === "") updateData.projectId = null;
      const res = await axios.put(`/tasks/${editingTaskId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTaskIndex = tasks.findIndex(
        (task) => task.id === editingTaskId
      );
      if (updatedTaskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[updatedTaskIndex] = {
          ...updatedTasks[updatedTaskIndex],
          ...updateData,
        };
        if (onTaskUpdated) {
          onTaskUpdated(updatedTasks);
        }
      }
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err);
      setError(
        `Failed to update task: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setError(null);
  };

  const showDeleteConfirmation = (taskId, e) => {
    e.stopPropagation();
    setDeleteConfirmationId(taskId);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteConfirmationId(null);
  };

  const handleDelete = async (taskId, e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await axios.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      if (onTaskUpdated) {
        onTaskUpdated(updatedTasks);
      }
      setDeleteConfirmationId(null);
      setSelectedTaskId(null);
      if (currentTasks.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed") return "status-badge completed";
    if (statusLower === "in_progress" || statusLower === "inprogress")
      return "status-badge in-progress";
    if (statusLower === "new") return "status-badge new";
    return "status-badge";
  };

  const getPriorityClass = (priority) => {
    const priorityLower = priority?.toLowerCase();
    if (priorityLower === "critical") return "priority-badge critical";
    if (priorityLower === "high") return "priority-badge high";
    if (priorityLower === "medium") return "priority-badge medium";
    if (priorityLower === "low") return "priority-badge low";
    return "priority-badge";
  };

  // Helper to get the username from a given assigneeId
  const getAssigneeName = (assigneeId) => {
    if (!assigneeId) return "Unassigned";
    const user = users.find((u) => String(u.id) === assigneeId);
    return user ? user.username : "Unknown User";
  };

  return (
    <div className="task-table-wrapper">
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: "35%" }}>Title</th>
              <th style={{ width: "15%" }}>Status</th>
              <th style={{ width: "15%" }}>Priority</th>
              <th style={{ width: "15%" }}>Due Date</th>
              <th style={{ width: "10%" }}>Assignee</th>
              <th style={{ width: "10%" }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No tasks available
                </td>
              </tr>
            ) : (
              currentTasks.map((task) => {
                const isEditing = editingTaskId === task.id;
                const isSelected = selectedTaskId === task.id;
                const isConfirmingDelete = deleteConfirmationId === task.id;
                return (
                  <React.Fragment key={task.id}>
                    <tr
                      className={`task-row ${
                        isSelected ? "selected-row" : ""
                      } ${isEditing ? "editing-row" : ""}`}
                      onClick={(e) => selectTask(task.id, e)}
                    >
                      <td className="task-title">{task.title}</td>
                      <td>
                        <span className={getStatusClass(task.status)}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className={getPriorityClass(task.priority)}>
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{getAssigneeName(task.assigneeId)}</td>
                      <td className="actions-cell">
                        {deleteConfirmationId === task.id ? (
                          <div className="delete-confirmation">
                            <span className="confirm-text">Delete?</span>
                            <button
                              className="confirm-btn yes-btn action-btn"
                              onClick={(e) => handleDelete(task.id, e)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? "..." : "Yes"}
                            </button>
                            <button
                              className="confirm-btn no-btn action-btn"
                              onClick={cancelDelete}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="edit-btn action-btn"
                              onClick={(e) => startEditing(task, e)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn action-btn"
                              onClick={(e) =>
                                showDeleteConfirmation(task.id, e)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {isEditing && (
                      <tr className="edit-row">
                        <td colSpan={6}>
                          <form onSubmit={handleSubmit} className="edit-form">
                            {error && (
                              <div className="error-message">{error}</div>
                            )}
                            <div className="form-grid">
                              <div className="form-group">
                                <label htmlFor="title">Title:</label>
                                <input
                                  type="text"
                                  id="title"
                                  name="title"
                                  value={editFormData.title}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="status">Status:</label>
                                <select
                                  id="status"
                                  name="status"
                                  value={editFormData.status}
                                  onChange={handleInputChange}
                                >
                                  <option value="new">New</option>
                                  <option value="in_progress">
                                    In Progress
                                  </option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label htmlFor="priority">Priority:</label>
                                <select
                                  id="priority"
                                  name="priority"
                                  value={editFormData.priority}
                                  onChange={handleInputChange}
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                  <option value="critical">Critical</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label htmlFor="dueDate">Due Date:</label>
                                <input
                                  type="date"
                                  id="dueDate"
                                  name="dueDate"
                                  value={editFormData.dueDate}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="assigneeId">Assignee:</label>
                                {isLoadingUsers ? (
                                  <div className="loading-indicator">
                                    Loading users...
                                  </div>
                                ) : userFetchError ? (
                                  <div className="error-message small">
                                    {userFetchError}
                                  </div>
                                ) : (
                                  <select
                                    id="assigneeId"
                                    name="assigneeId"
                                    value={editFormData.assigneeId}
                                    onChange={handleInputChange}
                                  >
                                    <option value="">Unassigned</option>
                                    {users.length > 0 ? (
                                      users.map((user) => (
                                        <option
                                          key={user.id}
                                          value={String(user.id)}
                                        >
                                          {user.username}
                                        </option>
                                      ))
                                    ) : (
                                      <option disabled>
                                        No users available
                                      </option>
                                    )}
                                  </select>
                                )}
                              </div>
                              <div className="form-group">
                                <label htmlFor="estimatedHours">
                                  Estimated Hours:
                                </label>
                                <input
                                  type="number"
                                  id="estimatedHours"
                                  name="estimatedHours"
                                  value={editFormData.estimatedHours}
                                  onChange={handleInputChange}
                                  min="0"
                                  step="0.5"
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="tags">Tags:</label>
                                <input
                                  type="text"
                                  id="tags"
                                  name="tags"
                                  value={editFormData.tags}
                                  onChange={handleInputChange}
                                  placeholder="Comma separated tags"
                                />
                              </div>
                              <div className="form-group full-width">
                                <label htmlFor="description">
                                  Description:
                                </label>
                                <textarea
                                  id="description"
                                  name="description"
                                  value={editFormData.description}
                                  onChange={handleInputChange}
                                  rows="3"
                                ></textarea>
                              </div>
                            </div>
                            <div className="form-actions">
                              <button
                                type="submit"
                                className="save-btn"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                              </button>
                              <button
                                type="button"
                                className="cancel-btn"
                                onClick={cancelEditing}
                                disabled={isSubmitting}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-arrow"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={
                page === currentPage
                  ? "pagination-btn active-page"
                  : "pagination-btn"
              }
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-arrow"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskTable;
