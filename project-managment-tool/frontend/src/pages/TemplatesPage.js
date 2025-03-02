import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css"; // Reuse the dashboard styles

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProjectId = localStorage.getItem("selectedProjectId") || "";
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
        { name, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName("");
      setDescription("");
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

  const handleApplyTemplate = async (templateId) => {
    setLoading(true);
    setError("");
    try {
      const tasks = [
        {
          title: "Task 1 from template",
          description: "This is a task created from a template",
          status: "To Do",
          projectId: selectedProjectId,
        },
        {
          title: "Task 2 from template",
          description: "This is another task created from a template",
          status: "To Do",
          projectId: selectedProjectId,
        },
      ];

      await axios.post(
        `/templates/${templateId}/apply`,
        { projectId: selectedProjectId, tasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Tasks created from template!");
      navigate("/");
    } catch (err) {
      console.error("Error applying template", err);
      setError("Failed to apply template");
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
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((tpl) => (
                    <tr key={tpl.id}>
                      <td>{tpl.name}</td>
                      <td>{tpl.description}</td>
                      <td className="text-right">
                        <button
                          onClick={() => handleApplyTemplate(tpl.id)}
                          className="btn-secondary"
                          disabled={loading}
                        >
                          {loading ? "Applying..." : "Apply"}
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
