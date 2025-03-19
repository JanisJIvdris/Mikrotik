require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
const express = require("express");
const cors = require("cors");
const { sequelize, Project } = require("./models");
const config = require("./config/config");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const templateRoutes = require("./routes/templateRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/templates", templateRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      // Authenticate database connection
      await sequelize.authenticate();
      console.log("Database connected successfully.");

      if (process.env.NODE_ENV === "development") {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized (alter sync).");
      } else {
        await sequelize.sync();
        console.log("Database synchronized.");
      }

      // Create a default project if none exists
      const [defaultProject, created] = await Project.findOrCreate({
        where: { name: "Default Project" },
        defaults: { description: "Automatically created default project." },
      });
      console.log("Default Project ID:", defaultProject.id);

      // Start the server only if the database is fully initialized
      const PORT = config.PORT;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Critical error during database initialization:", error);
      process.exit(1); // Exits the process if initialization fails
    }
  })();
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
