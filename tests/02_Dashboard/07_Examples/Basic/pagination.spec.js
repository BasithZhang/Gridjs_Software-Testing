import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/pagination";

test.describe("UI testing", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Pagination", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "pagination",
            level: 1,
        });
        await expect(title).toBeVisible(title);

        await expect(title).toHaveText("Pagination");
    });

    test("Check the home page link", async ({ page }) => {
        const link = page.getByRole("link", { name: "Home page" });
        await expect(link).toBeVisible();

        await link.click();

        await expect(page).toHaveURL("http://localhost:3000");
    });

    test("When pagination is set to true", async ({ page }) => {
        // Previous and Next page button should be exist
        const previous = page.getByRole("button", { name: "Previous" }).nth(1);
        const next = page.getByRole("button", { name: "Next" }).nth(1);

        await expect(previous).toBeVisible();
        await expect(next).toBeVisible();
    });

    // test("When pagination is set to false", async ({ page }) => {});
});
