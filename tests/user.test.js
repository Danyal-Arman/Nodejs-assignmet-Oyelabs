import request from "supertest";
import app from "../app.js";

const getEmail = () => `user${Math.floor(Math.random() * 1000)}@gmail.com`;
const getInvalidEmail = () => `user${Math.floor(Math.random() * 1000)}@gmail`;

describe("User routes", () => {
  test("POST /users", async () => {
    const response = await request(app).post("/users").send({
      name: "Danyal Arman",
      email: getEmail(),
    });
    console.log("Create user", response.body);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User created successfully");
  });

  test("should return 400 if name is missing", async () => {
    const response = await request(app)
      .post("/users")
      .send({ email: getEmail() });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Name is required");
  });

  test("should return 400 if email is missing", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Danyal Arman" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email is required");
  });

  test("should return 400 if email is invalid", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Danyal Arman", email: "danyalarman.com" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email format");
  });

  test("should return 409 if user already exists", async () => {
    const email = getEmail();

    await request(app).post("/users").send({
      name: "Danyal",
      email,
    });

    const response = await request(app).post("/users").send({
      name: "Danyal",
      email,
    });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User with this email already exists");
  });

  test("GET /users", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    expect(response.body).toHaveProperty("totalUsers");
    expect(response.body).toHaveProperty("currentPage");
    expect(response.body).toHaveProperty("totalPages");
    expect(response.body).toHaveProperty("users");

    expect(response.body.message).toBe("Users fetched successfully");
  });

  test("should return users for page 2 with limit 5", async () => {
    const response = await request(app).get("/users?page=2&limit=5");

    expect(response.status).toBe(200);
    expect(response.body.currentPage).toBe(2);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  test("GET /users/:id", async () => {
    const createResponse = await request(app).post("/users").send({
      name: "Danyal",
      email: getEmail(),
    });

    const userId = createResponse.body.user.id;

    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User fetched successfully");
  });

  test("should return 404 if user is not found", async () => {
    const response = await request(app).get("/users/999");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  test("PUT /users/:id", async () => {
    const createResponse = await request(app).post("/users").send({
      name: "Tim Allen",
      email: getEmail(),
    });
    const userId = createResponse.body.user.id;

    const response = await request(app).put(`/users/${userId}`).send({
      name: "Arman arman",
      email: getEmail(),
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User updated successfully");
  });

  test("should return 404 if user is not found", async () => {
    const response = await request(app).put("/users/999").send({
      name: "sam khan",
      email: getEmail(),
    });
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  test("DELETE /users/:id", async () => {
    const createResponse = await request(app).post("/users").send({
      name: "Test User",
      email: getEmail(),
    });
    const userId = createResponse.body.user.id;
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("User deleted successfully");
  });

  test("should return 404 if user is not found", async () => {
    const response = await request(app).delete("/users/999");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });
});
