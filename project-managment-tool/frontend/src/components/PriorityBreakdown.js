import React from "react";

const PriorityBreakdown = ({ taskStats, totalTasks }) => {
  return (
    <div className="card">
      <h3>Priority Breakdown</h3>
      <div className="priority-item">
        <div className="priority-header">
          <span>Critical</span>
          <span>{taskStats.critical}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill progress-critical"
            style={{
              width: `${
                totalTasks > 0 ? (taskStats.critical / totalTasks) * 100 : 0
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="priority-item">
        <div className="priority-header">
          <span>High</span>
          <span>{taskStats.high}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill progress-high"
            style={{
              width: `${
                totalTasks > 0 ? (taskStats.high / totalTasks) * 100 : 0
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="priority-item">
        <div className="priority-header">
          <span>Medium</span>
          <span>{taskStats.medium}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill progress-medium"
            style={{
              width: `${
                totalTasks > 0 ? (taskStats.medium / totalTasks) * 100 : 0
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="priority-item">
        <div className="priority-header">
          <span>Low</span>
          <span>{taskStats.low}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill progress-low"
            style={{
              width: `${
                totalTasks > 0 ? (taskStats.low / totalTasks) * 100 : 0
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PriorityBreakdown;
