const fetch = require("node-fetch");
const { ROOT_URL, token } = require("../functional-tests/index");

// /api/:board/:thread/replies

describe("get all replies GET /:board/:thread/replies", () => {
  test("valid request", async () => {
    expect.assertions(1);
    const response = await fetch(
      `${ROOT_URL}/testingboard/testingthread/replies`
    );
    expect(response.status).toBe(200);
  });
});
