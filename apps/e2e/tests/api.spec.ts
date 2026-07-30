import { expect, test } from "@playwright/test";

test("GET / returns the API response", async ({ request }) => {
  const response = await request.get("/");

  expect(response.status()).toBe(200);
  await expect(response).toBeOK();
  expect(await response.text()).toBe("Hello World!");
});
