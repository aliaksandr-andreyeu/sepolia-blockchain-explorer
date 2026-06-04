import { expect, test } from "@playwright/test";

test.describe("Search", () => {
  test("navigates to block page from header search", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("search-input").waitFor();

    await page.getByTestId("search-input").fill("12345678");
    await page.getByTestId("search-submit").click();

    await expect(page).toHaveURL(/\/block\/12345678/, { timeout: 15_000 });
    // Block detail, setup notice (no API key), or 404 (key set but block missing)
    await expect(
      page
        .getByRole("heading", { name: /Block #/i })
        .or(page.getByText("Alchemy API key required"))
        .or(page.getByRole("heading", { name: "404" })),
    ).toBeVisible();
  });

  test("shows validation error for invalid query", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("search-input").waitFor();

    await page.getByTestId("search-input").fill("not-valid");
    await page.getByTestId("search-submit").click();

    await expect(page.getByTestId("search-error")).toBeVisible();
    await expect(page.getByTestId("search-error")).toContainText(
      /Invalid format/i,
    );
  });
});
