import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("new");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/templates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTemplates(res.data);
      } catch (err) {
        console.error("Error fetching templates", err);
        setError("Failed to load templates");
      }
    };
    fetchTemplates();
  }, [token]);

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "/templates",
        { name, description, status, priority, dueDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Clear form fields after successful creation
      setName("");
      setDescription("");
      setStatus("new");
      setPriority("medium");
      setDueDate("");
      const res = await axios.get("/templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTemplates(res.data);
    } catch (err) {
      console.error("Error creating template", err);
      setError("Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  // New: Handler to delete a template
  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update the local templates list after deletion
      setTemplates(templates.filter((tpl) => tpl.id !== templateId));
    } catch (err) {
      console.error("Error deleting template", err);
      setError("Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2 className="header-title">Templates</h2>
      </div>

      {error && (
        <div className="card error-card">
          <p>{error}</p>
        </div>
      )}

      <div className="dashboard-layout">
        {/* Create Template Card */}
        <div className="card">
          <h3>Create Template</h3>
          <form onSubmit={handleCreateTemplate}>
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

            {/* New fields for additional task defaults */}
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

        {/* Existing Templates Card */}
        <div className="card">
          <h3>Existing Templates</h3>
          {templates.length === 0 ? (
            <p className="empty-text">No templates available yet.</p>
          ) : (
            <div className="table-wrapper">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((tpl) => (
                    <tr key={tpl.id}>
                      <td>{tpl.name}</td>
                      <td>{tpl.description}</td>
                      <td>{tpl.status}</td>
                      <td>{tpl.priority}</td>
                      <td>{tpl.dueDate ? tpl.dueDate.slice(0, 10) : ""}</td>
                      <td className="text-right">
                        <button
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          style={{
                            backgroundColor: "#d9534f",
                            border: "none",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                          disabled={loading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              width: "16px",
                              height: "16px",
                              verticalAlign: "middle",
                            }}
                            fill="white"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 6h18v2H3zm2 3h14l-1.5 12.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 9zm5-5h4v2h-4z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplatesPage;
