import React, { useState } from "react";
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

  const pageSize = 20;
  const totalPages = Math.ceil(tasks.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentTasks = tasks.slice(startIndex, startIndex + pageSize);

  const token = localStorage.getItem("token");

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Close editing form when changing pages
    setEditingTaskId(null);
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);

    // Initialize form with task data, handling potential nulls
    setEditFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "new",
      priority: task.priority || "medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      assigneeId: task.assigneeId || "",
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
      // Call the API to update the task
      const res = await axios.put(`/api/tasks/${editingTaskId}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Task updated successfully:", res.data);

      // Find the updated task in the original tasks array
      const updatedTaskIndex = tasks.findIndex(
        (task) => task.id === editingTaskId
      );

      if (updatedTaskIndex !== -1) {
        // Create a new array with the updated task
        const updatedTasks = [...tasks];
        updatedTasks[updatedTaskIndex] = {
          ...updatedTasks[updatedTaskIndex],
          ...editFormData,
        };

        // Call parent callback to update task list
        if (onTaskUpdated) {
          onTaskUpdated(updatedTasks);
        }
      }

      // Close edit mode
      setEditingTaskId(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setError(null);
  };

  // Function to get status badge class
  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed") return "status-badge completed";
    if (statusLower === "in_progress" || statusLower === "inprogress")
      return "status-badge in-progress";
    if (statusLower === "new") return "status-badge new";
    return "status-badge";
  };

  // Function to get priority badge class
  const getPriorityClass = (priority) => {
    const priorityLower = priority?.toLowerCase();
    if (priorityLower === "critical") return "priority-badge critical";
    if (priorityLower === "high") return "priority-badge high";
    if (priorityLower === "medium") return "priority-badge medium";
    if (priorityLower === "low") return "priority-badge low";
    return "priority-badge";
  };

  // Get unique assignees from tasks for the dropdown
  const getUniqueAssignees = () => {
    const assignees = new Map();

    tasks.forEach((task) => {
      if (task.assigneeId && task.assigneeName) {
        assignees.set(task.assigneeId, task.assigneeName);
      }
    });

    return Array.from(assignees).map(([id, name]) => ({ id, name }));
  };

  const uniqueAssignees = getUniqueAssignees();

  return (
    <div className="task-table-wrapper">
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>Title</th>
              <th style={{ width: "15%" }}>Status</th>
              <th style={{ width: "15%" }}>Priority</th>
              <th style={{ width: "15%" }}>Due Date</th>
              <th style={{ width: "15%" }} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  No tasks available
                </td>
              </tr>
            ) : (
              currentTasks.map((task) => {
                const isEditing = editingTaskId === task.id;

                // If this task is being edited, show the edit form
                if (isEditing) {
                  return (
                    <tr key={task.id} className="edit-row">
                      <td colSpan={5}>
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
                                <option value="in_progress">In Progress</option>
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
                              <select
                                id="assigneeId"
                                name="assigneeId"
                                value={editFormData.assigneeId}
                                onChange={handleInputChange}
                              >
                                <option value="">Unassigned</option>
                                {uniqueAssignees.map((assignee) => (
                                  <option key={assignee.id} value={assignee.id}>
                                    {assignee.name}
                                  </option>
                                ))}
                              </select>
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
                              <label htmlFor="description">Description:</label>
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
                  );
                }

                // Default view for non-editing rows
                return (
                  <tr
                    key={task.id}
                    className="task-row"
                    onClick={() => startEditing(task)}
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
                    <td className="actions-cell">
                      <button className="edit-btn">Edit</button>
                    </td>
                  </tr>
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
