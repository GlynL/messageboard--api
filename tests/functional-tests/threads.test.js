const fetch = require("node-fetch");
const { ROOT_URL, token } = require("../functional-tests/index");

// saved to delete thread
let id;

// /api/:board/threads

describe("get threads GET /api/:board/threads", () => {
  test("valid request", async () => {
    expect.assertions(1);
    const response = await fetch(`${ROOT_URL}/testingboard/threads`);
    expect(response.status).toBe(200);
  });

  test("invalid board name", async () => {
    expect.assertions(2);
    const response = await fetch(`${ROOT_URL}/invalidboard/threads`);
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Board doesn't exist.");
  });
});

describe("create thread POST /api/:board/threads", () => {
  test("create thread correctly", async () => {
    expect.assertions(1);
    const body = { text: "testing thread" };
    const response = await fetch(`${ROOT_URL}/testingboard/threads`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    id = data.threads[1]._id;
  });

  test("invalid board", async () => {
    expect.assertions(2);
    const body = { text: "testing thread" };
    const response = await fetch(`${ROOT_URL}/invalidboard/threads`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid board name.");
  });

  test("invalid user", async () => {
    expect.assertions(1);
    const body = { text: "testing thread" };
    const response = await fetch(`${ROOT_URL}/invalidboard/threads`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "wrongwrongwrong"
      }
    });
    expect(response.status).toBe(401);
  });
});

describe("delete thread DELETE /:board/threads/:id", () => {
  test("invalid board", async () => {
    expect.assertions(2);
    const response = await fetch(`${ROOT_URL}/invalidboard/threads/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid board name.");
  });

  test("wrong user", async () => {
    expect.assertions(1);
    const response = await fetch(`${ROOT_URL}/invalidboard/threads/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "wrongwrongwrong"
      }
    });
    expect(response.status).toBe(401);
  });

  test("wrong user", async () => {
    expect.assertions(1);
    const response = await fetch(`${ROOT_URL}/testingboard/threads/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(200);
  });
});
