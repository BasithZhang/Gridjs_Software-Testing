import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/hidden-columns";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Hidden Columns", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Hidden Columns",
            level: 1,
        });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Hidden Columns");
    });

    test("Click the link in the Note section", async ({ page }) => {
        const link = page.getByRole("link", { name: "search plugin" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL(
            "http://localhost:3000/docs/examples/search",
        );
    });

    test("Click the home page link", async ({ page }) => {
        const link = page.getByRole("link", { name: "Home page" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL("http://localhost:3000");
    });
});
