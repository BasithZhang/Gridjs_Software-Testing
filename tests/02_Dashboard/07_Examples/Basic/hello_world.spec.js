import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/hello-world";

test.describe("Grab the title", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/examples/hello-world",
        );
    });

    test("1. Grab the h1 title: Hello, World!", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Hello, World!",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("Hello, World!");
    });
});
