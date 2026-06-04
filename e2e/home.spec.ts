import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("shows explorer title and search", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Sepolia Blockchain Explorer" }),
    ).toBeVisible();
    await expect(page.getByPlaceholderText(/Search by Address/i)).toBeVisible();
    await expect(page.getByRole("link", { name: "SepoliaScan" })).toBeVisible();
  });

  test("shows setup notice or latest blocks section", async ({ page }) => {
    await page.goto("/");

    const setupNotice = page.getByText("Alchemy API key required");
    const latestBlocks = page.getByRole("heading", { name: "Latest Blocks" });

    await expect(setupNotice.or(latestBlocks)).toBeVisible();
  });
});
