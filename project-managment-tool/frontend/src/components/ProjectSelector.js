import React from "react";

const ProjectSelector = ({
  projects,
  selectedProjectId,
  setSelectedProjectId,
}) => {
  return (
    <div className="compact-selector">
      <label className="compact-label" htmlFor="project-select">
        Project:
      </label>
      <select
        id="project-select"
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
        className="compact-select"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
