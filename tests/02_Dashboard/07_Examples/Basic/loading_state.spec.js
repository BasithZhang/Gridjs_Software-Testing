import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/loading-state";

test.describe("Grab the title", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("1. Grab the h1 title: Loading State", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Loading State",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Loading State");
    });
});
