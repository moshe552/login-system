const request = require("supertest");
const app = require("../app");
const db = require("../db");


// Suppress console.error messages during testing
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  console.error.mockRestore();
});

describe("Registration username uniqueness", () => {
  test("It should reject registration with an existing username", async () => {
    const response = await request(app)
      .post("/register/new_register")
      .send({
        username: "moshe12",
        email: `newemail${Date.now()}@example.com`,
        password: "SecurePass123!",
        confirm_password: "SecurePass123!",
      });
    expect(response.statusCode).toBe(400);
    // console.log("response.body:", response.text);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        msg: "Username already in use",
      })
    );
  });
});

describe("Registration email uniqueness", () => {
  test("It should reject registration with an existing email", async () => {
    const response = await request(app)
      .post("/register/new_register")
      .send({
        username: `newUser${Date.now()}`,
        email: "mosdvo2662@gmail.com",
        password: "SecurePass123!",
        confirm_password: "SecurePass123!",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        msg: "E-mail already in use",
      })
    );
  });
});

describe("Registration password strength", () => {
  test("It should reject registration with a weak password", async () => {
    const response = await request(app)
      .post("/register/new_register")
      .send({
        username: `username${Date.now()}`,
        email: `newemail+${Date.now()}@gmail.com`,
        password: "weak",
        confirm_password: "weak",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        msg: "Password must be 6 or more characters and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
      })
    );
  });
});

describe("Registration password match", () => {
  test("It should reject registration with a non-matching password", async () => {
    const response = await request(app)
      .post("/register/new_register")
      .send({
        username: `newUser${Date.now()}`,
        email: `newemail${Date.now()}@gmail.com`,
        password: "SecurePass12!",
        confirm_password: "Secure1234!",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toContainEqual(
      expect.objectContaining({
        msg: "Confirm Password field must have the same value as the password field",
      })
    );
  });
});

describe("Registration success", () => {
  test("It should accept a valid registration", async () => {
    const response = await request(app)
      .post("/register/new_register")
      .send({
        username: `newUser${Date.now()}`,
        email: `newemail${Date.now()}@gmail.com`,
        password: "SecurePass1123!",
        confirm_password: "SecurePass1123!",
      });
    expect(response.statusCode).toBe(200);
    console.log("response:", response);
    expect(response.body.message).toBe("Registration successful");
  });
});

describe("Registration rate limiting", () => {
  test("It should reject registration attempts over the rate limit", async () => {
    process.env.NODE_ENV = "true";
    const attempts = 6; // Attempt to register one more time than the limit
    let response;
    for (let i = 0; i < attempts; i++) {
      response = await request(app)
        .post("/register/new_register")
        .send({
          username: `newUser${Date.now()}`,
          email: `newemail${Date.now()}@gmail.com`,
          password: "SecurePass12!",
          confirm_password: "SecurePass12!",
        });
    }
    // Now check the rate limit error on the 6th attempt
    process.env.NODE_ENV = "test";
    expect(response.statusCode).toBe(429);
    expect(response.body.message).toBe(
      "Too many accounts created from this IP, please try again after 15 minutes"
    );
  });
});

describe("Registration database error", () => {
  // Spy on db.queryAsync and mock its implementation locally for this test
  beforeEach(() => {
    jest.spyOn(db, "queryAsync").mockRejectedValue(new Error("Database error"));
  });
  // Restore the original implementation after this test
  afterEach(() => {
    db.queryAsync.mockRestore();
  });
  test("It should handle database errors", async () => {
    const response = await request(app)
      .post("/register/new_register")
      .send({
        username: `username${Date.now()}`,
        email: `newemail${Date.now()}@gmail.com`,
        password: "SecurePass12!",
        confirm_password: "SecurePass12!",
      });
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Database error");
  }
  );
}
);
