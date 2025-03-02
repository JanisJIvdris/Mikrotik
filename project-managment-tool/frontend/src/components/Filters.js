import React from "react";
import "./Filters.css";

const Filters = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  showMyTasks,
  setShowMyTasks,
}) => {
  return (
    <div className="filters-container">
      <div className="compact-filter">
        <label className="compact-label">Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="compact-select"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="compact-filter">
        <label className="compact-label">Priority:</label>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="compact-select"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="compact-filter checkbox-filter">
        <label className="checkbox-container">
          <input
            type="checkbox"
            className="checkbox"
            checked={showMyTasks}
            onChange={() => setShowMyTasks(!showMyTasks)}
          />
          <span className="compact-label">My Tasks Only</span>
        </label>
      </div>
    </div>
  );
};

export default Filters;
