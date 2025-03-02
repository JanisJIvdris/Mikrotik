import React, { useState } from "react";
import "./TaskTable.css";

function TaskTable({ tasks }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const pageSize = 20;
  const totalPages = Math.ceil(tasks.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentTasks = tasks.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleExpanded = (taskId) => {
    setExpandedTaskId(taskId === expandedTaskId ? null : taskId);
  };

  // Function to get status badge class
  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed") return "status-badge completed";
    if (statusLower === "in progress" || statusLower === "inprogress")
      return "status-badge in-progress";
    if (statusLower === "pending") return "status-badge pending";
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

  return (
    <div className="task-table-wrapper">
      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: "50%" }}>Title</th>
              <th style={{ width: "20%" }}>Status</th>
              <th style={{ width: "20%" }}>Priority</th>
              <th style={{ width: "10%" }} className="text-center">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  No tasks available
                </td>
              </tr>
            ) : (
              currentTasks.map((task) => {
                const isExpanded = expandedTaskId === task.id;
                return (
                  <React.Fragment key={task.id}>
                    <tr
                      className={`task-row ${isExpanded ? "expanded" : ""}`}
                      onClick={() => toggleExpanded(task.id)}
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
                      <td className="expand-cell">
                        <button className="expand-btn">
                          {isExpanded ? "−" : "+"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="expanded-row">
                        <td colSpan={4}>
                          <div className="expanded-content">
                            <div className="expanded-item">
                              <span className="expanded-label">
                                Description:
                              </span>
                              <span className="expanded-value">
                                {task.description || "No description provided"}
                              </span>
                            </div>
                            <div className="expanded-item">
                              <span className="expanded-label">Due Date:</span>
                              <span className="expanded-value">
                                {task.dueDate
                                  ? task.dueDate.slice(0, 10)
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
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
