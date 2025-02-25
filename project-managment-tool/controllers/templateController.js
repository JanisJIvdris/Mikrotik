const { Template, Task } = require("../models");

exports.createTemplate = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newTemplate = await Template.create({ name, description });
    return res.status(201).json(newTemplate);
  } catch (error) {
    return res.status(500).json({ message: "Error creating template." });
  }
};

exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll();
    return res.status(200).json(templates);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving templates." });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findByPk(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }
    return res.status(200).json(template);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving template." });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const [updated] = await Template.update(
      { name, description },
      { where: { id } }
    );
    if (!updated) {
      return res.status(404).json({ message: "Template not found." });
    }
    return res.status(200).json({ message: "Template updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error updating template." });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Template.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Template not found." });
    }
    return res.status(200).json({ message: "Template deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting template." });
  }
};

// "Apply" a template: create tasks in bulk
exports.applyTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { tasks } = req.body; // e.g. an array of tasks

    const template = await Template.findByPk(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    if (tasks && tasks.length) {
      await Task.bulkCreate(tasks);
    }

    return res.status(201).json({ message: "Tasks created from template." });
  } catch (error) {
    return res.status(500).json({ message: "Error applying template." });
  }
};
