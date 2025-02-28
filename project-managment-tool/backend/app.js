require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const config = require("./config/config");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const templateRoutes = require("./routes/templateRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/templates", templateRoutes);

if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connected successfully.");

      if (process.env.NODE_ENV === "development") {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized (alter sync).");
      } else {
        await sequelize.sync();
        console.log("Database synchronized.");
      }
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  })();

  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
