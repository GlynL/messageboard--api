const fetch = require("node-fetch");
const { ROOT_URL, token } = require("../functional-tests/index");

describe("get all boards, GET /api/boards", () => {
  test("all boards", async () => {
    expect.assertions(1);
    const response = await fetch(`${ROOT_URL}/boards`);
    expect(response.ok).toBeTruthy();
    const data = await response.json();
  });
});

describe("add new board, POST /api/boards", () => {
  // clean up test board
  beforeAll(() => {
    fetch(`${ROOT_URL}/boards?key=secret&name=testboard`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
  });

  test("create new board", async () => {
    expect.assertions(2);
    const body = { name: "testboard" };
    const response = await fetch(`${ROOT_URL}/boards`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(200);
    const data = await response.text();
    expect(data).toBe("Board created successfully");
  });

  test("duplicate name", async () => {
    expect.assertions(2);
    const body = { name: "testboard" };
    const response = await fetch(`${ROOT_URL}/boards`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Board with this name already exists.");
  });

  test("no name provided", async () => {
    expect.assertions(2);
    const body = {};
    const response = await fetch(`${ROOT_URL}/boards`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("You must provide a board name");
  });
});
