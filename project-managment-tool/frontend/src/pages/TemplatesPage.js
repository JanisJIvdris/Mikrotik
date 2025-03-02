import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";
import CreateTemplateForm from "../components/CreateTemplateForm";
import ExistingTemplatesList from "../components/ExistingTemplatesList";

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTemplates();
  }, []);

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

  const handleCreateTemplate = async (templateData) => {
    setLoading(true);
    setError("");
    try {
      await axios.post("/templates", templateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh templates list after creation
      fetchTemplates();
      return true; // Success indicator
    } catch (err) {
      console.error("Error creating template", err);
      setError("Failed to create template");
      return false; // Failure indicator
    } finally {
      setLoading(false);
    }
  };

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

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        <CreateTemplateForm onSubmit={handleCreateTemplate} loading={loading} />
        <ExistingTemplatesList
          templates={templates}
          onDelete={handleDeleteTemplate}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default TemplatesPage;
