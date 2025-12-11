import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/import-async";

test.describe("Grab the title", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("1. Grab the h1 title: JSON", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Async data import",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Async data import");
    });
});
