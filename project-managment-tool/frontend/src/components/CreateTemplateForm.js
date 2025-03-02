import React, { useState } from "react";
import "./CreateTemplateForm.css";

function CreateTemplateForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const templateData = { name, description, status, priority, dueDate };
    const success = await onSubmit(templateData);

    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus("new");
    setPriority("medium");
    setDueDate("");
  };

  return (
    <div className="card">
      <h3>Create Template</h3>
      <form onSubmit={handleSubmit}>
        <div className="filter-group">
          <label className="filter-label" htmlFor="template-name">
            Name
          </label>
          <input
            id="template-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="template-description">
            Description
          </label>
          <textarea
            id="template-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
            className="form-control"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="template-status">
            Status
          </label>
          <select
            id="template-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-control"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label" htmlFor="template-priority">
            Priority
          </label>
          <select
            id="template-priority"
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
          <label className="filter-label" htmlFor="template-dueDate">
            Due Date
          </label>
          <input
            id="template-dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Creating..." : "Create Template"}
        </button>
      </form>
    </div>
  );
}

export default CreateTemplateForm;
