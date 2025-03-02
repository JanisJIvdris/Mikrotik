const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Template = sequelize.define("Template", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    tasks: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
  });

  return Template;
};
