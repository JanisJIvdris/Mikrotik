import React from "react";
import "./TaskStatsSummary.css";
import NewTaskIcon from "../assets/icons/NewTaskIcon";
import InProgressIcon from "../assets/icons/InProgressIcon";
import CompletedIcon from "../assets/icons/CompletedIcon";
import OverdueIcon from "../assets/icons/OverdueIcon";

const TaskStatsSummary = ({ taskStats }) => {
  return (
    <div className="summary-container">
      <div className="summary-card">
        <div className="icon-container icon-blue">
          <NewTaskIcon className="icon" />
        </div>
        <div>
          <p className="stats-text">New Tasks</p>
          <p className="stats-number">{taskStats.new}</p>
        </div>
      </div>
      <div className="summary-card">
        <div className="icon-container icon-yellow">
          <InProgressIcon className="icon" />
        </div>
        <div>
          <p className="stats-text">In Progress</p>
          <p className="stats-number">{taskStats.in_progress}</p>
        </div>
      </div>
      <div className="summary-card">
        <div className="icon-container icon-green">
          <CompletedIcon className="icon" />
        </div>
        <div>
          <p className="stats-text">Completed</p>
          <p className="stats-number">{taskStats.completed}</p>
        </div>
      </div>
      <div className="summary-card">
        <div className="icon-container icon-red">
          <OverdueIcon className="icon" />
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
