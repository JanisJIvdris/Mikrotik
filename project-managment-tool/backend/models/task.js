const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Task = sequelize.define("Task", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("new", "in_progress", "completed"),
      defaultValue: "new",
    },
    assigneeId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    estimatedHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
      // Store tags as comma-separated string
    },
    attachments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    completedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Task;
};
