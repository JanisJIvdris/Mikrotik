const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

let token;
let userId;
let projectId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await request(app).post("/auth/register").send({
    username: "taskUser",
    password: "password",
  });
  const loginRes = await request(app).post("/auth/login").send({
    username: "taskUser",
    password: "password",
  });
  token = loginRes.body.token;
  userId = loginRes.body.userId;

  const projectRes = await request(app)
    .post("/projects")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Test Project",
      description: "Project created for task tests",
    });
  projectId = projectRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Task Endpoints", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Fix Login Bug",
        description: "Users cannot log in",
        status: "new",
        assigneeId: userId,
        priority: "high",
        dueDate: "2024-03-01",
        projectId: projectId,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("priority", "high");
  });

  it("should retrieve all tasks", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
