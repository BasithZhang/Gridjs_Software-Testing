import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/sorting";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Sorting", async ({ page }) => {
        const title = page.getByRole("heading", { name: "Sorting", level: 1 });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Sorting");
    });

    test("Check the home page link", async ({ page }) => {
        const link = page.getByRole("link", { name: "Home page" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL("http://localhost:3000");
    });
});
