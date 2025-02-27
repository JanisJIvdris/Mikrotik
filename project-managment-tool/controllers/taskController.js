const { Task } = require("../models");

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      assigneeId,
      priority,
      dueDate,
      projectId,
    } = req.body;

    const newTask = await Task.create({
      title,
      description,
      status,
      assigneeId,
      priority,
      dueDate,
      projectId,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating task.", error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { assigneeId } = req.query;
    const whereClause = assigneeId ? { assigneeId } : {};
    const tasks = await Task.findAll({ where: whereClause });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving tasks." });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving task." });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      assigneeId,
      priority,
      dueDate,
      projectId,
    } = req.body;

    const [updated] = await Task.update(
      { title, description, status, assigneeId, priority, dueDate, projectId },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json({ message: "Task updated successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating task.", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting task." });
  }
};
