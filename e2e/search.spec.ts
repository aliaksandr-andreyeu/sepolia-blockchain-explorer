import { expect, test } from "@playwright/test";

test.describe("Search", () => {
  test("navigates to block page from header search", async ({ page }) => {
    await page.goto("/");

    const input = page.getByPlaceholderText(/Search by Address/i);
    await input.fill("12345678");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL(/\/block\/12345678$/);
    await expect(
      page
        .getByRole("heading", { name: /Block #/i })
        .or(page.getByText("Alchemy API key required")),
    ).toBeVisible();
  });

  test("shows validation error for invalid query", async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholderText(/Search by Address/i).fill("not-valid");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText(/Invalid format/i)).toBeVisible();
  });
});
