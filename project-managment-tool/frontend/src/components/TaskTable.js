import React, { useState } from "react";
import "./TaskTable.css";

function TaskTable({ tasks }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const pageSize = 10;
  const totalPages = Math.ceil(tasks.length / pageSize);

  // Pagination logic
  const startIndex = (currentPage - 1) * pageSize;
  const currentTasks = tasks.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleExpanded = (taskId) => {
    setExpandedTaskId(taskId === expandedTaskId ? null : taskId);
  };

  return (
    <div className="task-table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th style={{ width: "50%" }}>Title</th>
            <th style={{ width: "20%" }}>Status</th>
            <th style={{ width: "20%" }}>Priority</th>
            <th style={{ width: "10%" }}>Expand</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            return (
              <React.Fragment key={task.id}>
                <tr
                  className="task-row"
                  onClick={() => toggleExpanded(task.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.priority}</td>
                  <td>{isExpanded ? "-" : "+"}</td>
                </tr>
                {isExpanded && (
                  <tr className="expanded-row">
                    <td colSpan={4}>
                      <div className="expanded-content">
                        <strong>Description:</strong> {task.description} <br />
                        <strong>Due Date:</strong>{" "}
                        {task.dueDate ? task.dueDate.slice(0, 10) : "N/A"}{" "}
                        <br />
                        {/* Show more fields if needed, e.g. assignee, project, etc. */}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? "active-page" : ""}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TaskTable;
