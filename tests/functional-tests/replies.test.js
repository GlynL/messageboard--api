const fetch = require("node-fetch");
const { ROOT_URL, token } = require("../functional-tests/index");
const threadId = "5bfbb7421b02cc19246f6727";

// reply id for testing
let id;
// /api/:board/:thread/replies

describe("get all replies GET /:board/:thread/replies", () => {
  test("valid request", async () => {
    expect.assertions(1);
    const response = await fetch(
      `${ROOT_URL}/testingboard/${threadId}/replies`
    );
    expect(response.status).toBe(200);
  });

  test("invalid board name", async () => {
    expect.assertions(2);
    const response = await fetch(
      `${ROOT_URL}/invalidboard/testingthread/replies`
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid board name.");
  });

  test("invalid thread id", async () => {
    expect.assertions(2);
    const response = await fetch(`${ROOT_URL}/testingboard/invalidid/replies`);
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid thread.");
  });
});

describe("create new reply", () => {
  test("valid reply creation", async () => {
    expect.assertions(2);
    const body = { text: "test reply" };
    const response = await fetch(
      `${ROOT_URL}/testingboard/${threadId}/replies`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }
    );
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("Reply added successfully");
    id = data.thread.replies[0]._id;
  });

  test("invalid board", async () => {
    expect.assertions(2);
    const body = { text: "test reply" };
    const response = await fetch(
      `${ROOT_URL}/invalidboard/${threadId}/replies`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid board name.");
  });

  test("invalid thread id", async () => {
    expect.assertions(2);
    const body = { text: "test reply" };
    const response = await fetch(`${ROOT_URL}/testingboard/invalidid/replies`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid thread.");
  });

  test("invalid user", async () => {
    expect.assertions(1);
    const body = { text: "test reply" };
    const response = await fetch(`${ROOT_URL}/testingboard/invalidid/replies`, {
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

describe("delete reply DELETE /:board/:thread/replies/:id", () => {
  test("valid delete", async () => {
    expect.assertions(1);
    const response = await fetch(
      `${ROOT_URL}/testingboard/${threadId}/replies/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }
    );
    expect(response.status).toBe(200);
  });

  test("invalid board", async () => {
    expect.assertions(2);
    const response = await fetch(
      `${ROOT_URL}/invalidboard/${threadId}/replies/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid board name.");
  });

  test("invalid thread id", async () => {
    expect.assertions(2);
    const response = await fetch(
      `${ROOT_URL}/testingboard/invalidthread/replies/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid thread.");
  });

  test("invalid reply id", async () => {
    expect.assertions(2);
    const response = await fetch(
      `${ROOT_URL}/testingboard/${threadId}/replies/invalidid`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      }
    );
    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("Invalid reply.");
  });

  test("invalid user", async () => {
    expect.assertions(1);
    const response = await fetch(
      `${ROOT_URL}/testingboard/invalidthread/replies/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "wrongwrongwrong"
        }
      }
    );
    expect(response.status).toBe(401);
  });
});
