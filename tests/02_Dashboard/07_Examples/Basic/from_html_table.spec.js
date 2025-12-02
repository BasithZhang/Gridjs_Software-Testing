import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/from";

test.describe("Grab the title", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: From HTML Table", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "From HTML Table",
            level: 1,
        });
        await expect(title).toBeVisible();

        await expect(title).toHaveText("From HTML Table");
    });
});
