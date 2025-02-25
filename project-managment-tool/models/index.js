const { Sequelize } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS,
  {
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

// Initialize models
const User = require("./user")(sequelize);
const Task = require("./task")(sequelize);
const Template = require("./template")(sequelize);

// Set up relationships
User.hasMany(Task, { foreignKey: "assigneeId" });
Task.belongsTo(User, { foreignKey: "assigneeId" });

module.exports = {
  sequelize,
  User,
  Task,
  Template,
};
