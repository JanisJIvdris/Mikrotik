import React from "react";
import "./TemplateSelector.css";

function TemplateSelector({
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
  templateQuantity,
  setTemplateQuantity,
  onApplyTemplate,
}) {
  return (
    <div className="template-selector-card card">
      <h3>Apply Template</h3>
      {templates.length > 0 ? (
        <div className="template-form">
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="template-select form-control"
          >
            {templates.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </select>
          <div className="quantity-container">
            <label>Task Count:</label>
            <input
              type="number"
              min="1"
              value={templateQuantity}
              onChange={(e) => setTemplateQuantity(e.target.value)}
              className="quantity-input form-control"
            />
          </div>
          <button onClick={onApplyTemplate} className="apply-template-btn btn">
            Apply Template
          </button>
        </div>
      ) : (
        <p className="no-templates-message">
          No templates available. Create some in the Templates section.
        </p>
      )}
    </div>
  );
}

export default TemplateSelector;
