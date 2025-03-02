import React from "react";
import "./ExistingTemplatesList.css";
import TrashBinIcon from "../assets/icons/TrashBinIcon";

function ExistingTemplatesList({ templates, onDelete, loading }) {
  return (
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
                      onClick={() => onDelete(tpl.id)}
                      className="btn-secondary"
                      style={{
                        backgroundColor: "#d9534f",
                        color: "white",
                        padding: "4px 8px",
                      }}
                      disabled={loading}
                    >
                      <TrashBinIcon
                        className="icon"
                        style={{
                          width: "16px",
                          height: "16px",
                          verticalAlign: "middle",
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExistingTemplatesList;
