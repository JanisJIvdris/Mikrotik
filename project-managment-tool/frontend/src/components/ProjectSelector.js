import React from "react";

const ProjectSelector = ({
  projects,
  selectedProjectId,
  setSelectedProjectId,
}) => {
  return (
    <div className="card">
      <h3>Project Selection</h3>
      <div className="filter-group">
        <label className="filter-label" htmlFor="project-select">
          Select Project
        </label>
        <select
          id="project-select"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectSelector;
