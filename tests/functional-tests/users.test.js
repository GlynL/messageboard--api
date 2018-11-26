const fetch = require("node-fetch");
const { ROOT_URL } = require("../functional-tests/index");
let token;

describe("user signup POST /api/users/signup", () => {
  // clean up test user
  beforeAll(() => {
    return fetch(`${ROOT_URL}/users?key=secret&email=test@test.com`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
  });

  test("correctly signed up", async () => {
    expect.assertions(1);
    const body = { email: "test@test.com", password: "test" };
    const response = await fetch(`${ROOT_URL}/users/signup`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    expect(response.ok).toBeTruthy();
    token = await response.json();
  });

  test("email already used", async () => {
    expect.assertions(2);
    const body = { email: "test@test.com", password: "test" };
    const response = await fetch(`${ROOT_URL}/users/signup`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Email already in use");
  });

  test("no email", async () => {
    expect.assertions(2);
    const body = { password: "test" };
    const response = await fetch(`${ROOT_URL}/users/signup`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    // expect(response.ok).toBeTruthy();
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("You must provide an email and password.");
  });

  test("no password", async () => {
    expect.assertions(2);
    const body = { email: "testingnopassword@test.com" };
    const response = await fetch(`${ROOT_URL}/users/signup`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("You must provide an email and password.");
  });
});
