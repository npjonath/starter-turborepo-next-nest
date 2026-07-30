import { expect, test } from "@playwright/test";

const applications = [
  {
    name: "web",
    sourcePath: "apps/web/app/page.tsx",
    url: process.env.E2E_WEB_URL ?? "http://127.0.0.1:3000",
  },
  {
    name: "docs",
    sourcePath: "apps/docs/app/page.tsx",
    url: process.env.E2E_DOCS_URL ?? "http://127.0.0.1:3001",
  },
] as const;

for (const application of applications) {
  test(`${application.name} renders the shared shadcn UI`, async ({ page }) => {
    const response = await page.goto(application.url);

    expect(response?.ok()).toBe(true);
    await expect(page).toHaveTitle("Create Next App");
    await expect(page.getByText(application.sourcePath)).toBeVisible();

    const documentationLink = page.getByRole("link", {
      name: "Read our docs",
    });

    await expect(documentationLink).toBeVisible();
    await expect(documentationLink).toHaveCSS("min-width", "160px");
  });
}
