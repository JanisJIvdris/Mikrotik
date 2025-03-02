import React from "react";

const Filters = ({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  showMyTasks,
  setShowMyTasks,
}) => {
  return (
    <div className="card">
      <h3>Filters</h3>
      <div className="filter-group">
        <label className="filter-label" htmlFor="status-filter">
          Status
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="priority-filter">
          Priority
        </label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="filter-group">
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={showMyTasks}
            onChange={() => setShowMyTasks(!showMyTasks)}
          />
          Show Only My Tasks
        </label>
      </div>
    </div>
  );
};

export default Filters;
