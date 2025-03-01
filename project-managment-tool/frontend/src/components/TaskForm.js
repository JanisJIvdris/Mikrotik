import React, { useState } from "react";
import axios from "axios";

function TaskForm({ projectId, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      onTaskCreated(res.data);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  return (
    <div>
      <h3>Create a New Task</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default TaskForm;
