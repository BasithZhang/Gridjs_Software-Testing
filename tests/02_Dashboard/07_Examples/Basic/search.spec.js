import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/search";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Search", async ({ page }) => {
        const title = page.getByRole("heading", { name: "Search", level: 1 });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Search");
    });

    test("Click the home page link", async ({ page }) => {
        const link = page.getByRole("link", { name: "Home page" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL("http://localhost:3000");
    });
});

test.describe("API testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("When search is set to true", async ({ page }) => {
        // The search box should be exist
        const box = page
            .getByRole("searchbox", { name: "Type a keyword..." })
            .first();
        await expect(box).toBeVisible();

        // Type a keyword to test thte functionality
        await box.click();

        await page.keyboard("j"); // fix the keyboard usage
        // we can find john
        const john = page.getByRole("gridcell", { name: "John" });
        await expect(john).toBeVisible();

        // Mark, Eion and Nisen is filtered
        const mark = page.getByRole("gridcell", { name: "Mark" });
        const eion = page.getByRole("gridcell", { name: "Eion" });
        const nisen = page.getByRole("gridcell", { name: "Nisen" });

        expect(mark).toBeFalsy();
        expect(eion).toBeFalsy();
        expect(nisen).toBeFalsy();
    });

    // test("When search is set to false", async ({ page }) => { });
});
