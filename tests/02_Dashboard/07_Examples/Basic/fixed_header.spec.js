import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/fixed-header";

test.describe("Fixed Header example page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("has h1 title 'Fixed Header'", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Fixed Header",
            level: 1,
        });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Fixed Header");
    });

    test("renders Grid.js table with expected columns", async ({ page }) => {
        await page.waitForSelector(".gridjs-wrapper");
        const nameHeader = page.locator('th[data-column-id="name"]');
        const emailHeader = page.locator('th[data-column-id="email"]');
        const titleHeader = page.locator('th[data-column-id="title"]');
        await expect(nameHeader).toBeVisible();
        await expect(emailHeader).toBeVisible();
        await expect(titleHeader).toBeVisible();
    });

    test("header stays visible when table content scrolls", async ({
        page,
    }) => {
        const container = page.locator(".gridjs-wrapper");
        await expect(container).toBeVisible();

        const scrollable = await container.evaluate(
            (el) => el.scrollHeight > el.clientHeight,
        );
        expect(scrollable).toBeTruthy();

        await container.evaluate((el) => {
            el.scrollTop = 200;
        });
        const headerName = page.locator('th[data-column-id="name"]');
        await expect(headerName).toBeVisible();
    });

    test("pagination shows 10 rows per page", async ({ page }) => {
        const rows = page.locator(".gridjs-container table tbody tr");
        await expect(rows).toHaveCount(10);
    });

    test("pagination navigates to page 2 and changes rows", async ({
        page,
    }) => {
        const firstRow = page
            .locator(".gridjs-container table tbody tr")
            .first();
        const before = (await firstRow.textContent())?.trim();

        const pageTwoBtn = page
            .locator(".gridjs-pages")
            .getByRole("button", { name: "2" });
        await expect(pageTwoBtn).toBeVisible();
        await pageTwoBtn.click();

        const afterRow = page
            .locator(".gridjs-container table tbody tr")
            .first();
        await expect(afterRow).not.toHaveText(before || "");
    });

    test("sorting by Name toggles ascending/descending", async ({ page }) => {
        const sortBtn = page.locator(
            'th[data-column-id="name"] button.gridjs-sort',
        );
        await expect(sortBtn).toBeVisible();

        const getNames = async () => {
            return await page
                .locator(".gridjs-wrapper table tbody tr td:nth-child(1)")
                .allTextContents();
        };

        await sortBtn.click();
        await page.waitForTimeout(200);
        const asc = await getNames();
        const sortedAsc = [...asc].sort((a, b) => a.localeCompare(b));
        expect(asc).toEqual(sortedAsc);

        await sortBtn.click();
        await page.waitForTimeout(200);
        const desc = await getNames();
        const sortedDesc = [...desc].sort((a, b) => b.localeCompare(a));
        expect(desc).toEqual(sortedDesc);
    });

    test("header position sticks to container top on scroll", async ({
        page,
    }) => {
        const container = page.locator(".gridjs-wrapper");
        const header = page.locator(".gridjs-wrapper thead");

        const { top: cTop } = await container.evaluate((el) =>
            el.getBoundingClientRect(),
        );
        const { top: hTopBefore } = await header.evaluate((el) =>
            el.getBoundingClientRect(),
        );

        await container.evaluate((el) => {
            el.scrollTop = 250;
        });

        const { top: hTopAfter } = await header.evaluate((el) =>
            el.getBoundingClientRect(),
        );
        expect(Math.abs(hTopBefore - cTop)).toBeLessThan(3);
        expect(Math.abs(hTopAfter - cTop)).toBeLessThan(3);
    });
});

test.describe("All links on the blog page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
    });

    test("1. NPM link on the upper right corner", async ({ page }) => {
        const link = page.getByRole("link", { name: "NPM" });
        await expect(link).toBeVisible();
        await link.click();
        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://www.npmjs.com/package/gridjs");
    });

    test("2. Github link on the upper right corner", async ({ page }) => {
        const link = page.getByRole("link", { name: "Github" }).first();
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL("https://github.com/grid-js/gridjs");
    });

    // 3, 4 for Docs section on the bottom of the blog page
    test("3. Docs - Getting Started", async ({ page }) => {
        const link = page.getByRole("link", { name: "Getting Started" });
        await expect(link).toBeVisible();

        await link.click();
        await expect(page).toHaveURL("http://localhost:3000/docs");
    });

    test("4. Docs - Examples", async ({ page }) => {
        const link = page.getByRole("link", { name: "Examples" }).nth(1);
        await expect(link).toBeVisible();

        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/examples/hello-world",
        );
    });

    // 5 - 7 for the Community section
    test("5. Community - Stack Overflow", async ({ page }) => {
        const link = page.getByRole("link", { name: "Stack Overflow" });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL(
            "https://stackoverflow.com/questions/tagged/gridjs",
        );
    });

    test("6. Community - Discord", async ({ page }) => {
        const link = page.getByRole("link", { name: "Discord" });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://discord.com/invite/K55BwDY");
    });

    test("7. Community - Twitter", async ({ page }) => {
        const link = page.getByRole("link", { name: "Twitter" });
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://x.com/grid_js");
    });

    // 8, 9 for the More section
    test("8. More - Blog", async ({ page }) => {
        const link = page.getByRole("link", { name: "Blog" }).nth(1);
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL("http://localhost:3000/blog");
    });

    test("9. More - Github", async ({ page }) => {
        const link = page.getByRole("link", { name: "Github" }).nth(1);
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL("https://github.com/grid-js/gridjs");
    });
});
