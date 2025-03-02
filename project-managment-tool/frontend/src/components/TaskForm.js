import React, { useState } from "react";
import axios from "axios";
import "./TaskForm.css";

function TaskForm({ projectId, onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !dueDate) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const res = await axios.post(
        "/tasks",
        {
          title,
          description,
          status: "new",
          assigneeId: userId,
          priority,
          dueDate,
          projectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onTaskAdded(res.data);

      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error creating task.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="filter-group">
        <label className="filter-label" htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-control"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="3"
          className="form-control"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="task-priority">
          Priority
        </label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="form-control"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="task-due-date">
          Due Date
        </label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="form-control"
        />
      </div>

      <button type="submit" className="btn">
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;
