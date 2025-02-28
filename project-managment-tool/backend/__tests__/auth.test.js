const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

beforeAll(async () => {
  // For tests, ensures a clean database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Authentication Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      password: "password",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully.");
  });

  it("should login an existing user and return a token and userId", async () => {
    // Register first (if not already)
    await request(app).post("/auth/register").send({
      username: "loginUser",
      password: "password",
    });

    const res = await request(app).post("/auth/login").send({
      username: "loginUser",
      password: "password",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });
});
