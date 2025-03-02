import React from "react";
import "./TaskStatsSummary.css";

const TaskStatsSummary = ({ taskStats }) => {
  return (
    <div className="summary-container">
      <div className="summary-card">
        <div className="icon-container icon-blue">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <p className="stats-text">New Tasks</p>
          <p className="stats-number">{taskStats.new}</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="icon-container icon-yellow">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="stats-text">In Progress</p>
          <p className="stats-number">{taskStats.in_progress}</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="icon-container icon-green">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="stats-text">Completed</p>
          <p className="stats-number">{taskStats.completed}</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="icon-container icon-red">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="stats-text">Overdue</p>
          <p className="stats-number">{taskStats.overdue}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskStatsSummary;
