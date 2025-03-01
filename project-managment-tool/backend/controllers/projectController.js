const { Project } = require("../models");

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }
    const project = await Project.create({ name, description });
    return res.status(201).json(project);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating project.", error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    return res.status(200).json(projects);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving projects.", error: error.message });
  }
};
