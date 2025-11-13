import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/blog";

/*
Try to Grab the title from the post Hello, World!
Expected title: Hello, World!
*/
test("Hello, World!", async ({ page }) => {
    await page.goto(url);

    /*
    1) <a href="/blog/hello-world" class="sidebarItemLink_node_modules-@docusaurus-theme-classic-lib-theme-BlogSidebar-Desktop-styles-module">Hello, World!</a> aka getByLabel('Blog recent posts navigation').getByRole('link', { name: 'Hello, World!' })
    2) <a itemprop="url" href="/blog/hello-world">Hello, World!</a> aka getByRole('main').getByRole('link', { name: 'Hello, World!' })
    */
    const HelloWorldLink = page
        .getByRole("link", {
            name: "Hello, World!",
        })
        .nth(1);

    await expect(HelloWorldLink).toBeVisible();

    await HelloWorldLink.click();
    await page.waitForURL(/.*\/blog\/hello-world/);

    const HelloWorldTitle = page.getByRole("heading", {
        name: "Hello, World!",
        level: 1,
    });
    await expect(HelloWorldTitle).toBeVisible();

    const title = await HelloWorldTitle.textContent();
    expect(title).toBe("Hello, World!");
});

/*
Try to Grab the title from the post Grid.js v3
Expected title: Grid.js v3
*/
test.describe("Blog post: Grid.js v3", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);

        /*
            1) <a href="/blog/gridjs-v3" class="sidebarItemLink_node_modules-@docusaurus-theme-classic-lib-theme-BlogSidebar-Desktop-styles-module">Grid.js v3</a> aka getByLabel('Blog recent posts navigation').getByRole('link', { name: 'Grid.js v3' })
            2) <a itemprop="url" href="/blog/gridjs-v3">Grid.js v3</a> aka getByRole('main').getByRole('link', { name: 'Grid.js v3' })
        */
        const GridjsLink = page
            .getByRole("link", {
                name: "Grid.js v3",
            })
            .nth(1);

        await expect(GridjsLink).toBeVisible();

        await GridjsLink.click();
        await page.waitForURL(/.*\/blog\/gridjs-v3/);
    });

    // Grad the h1 title "Grid.js v3"
    test("1. Grab the h1 title: Grid.js v3", async ({ page }) => {
        const GridjsTitle = page.getByRole("heading", {
            name: "Grid.js v3",
            level: 1,
        });
        await expect(GridjsTitle).toBeVisible();

        await expect(GridjsTitle).toHaveText("Grid.js v3");
    });

    // Grad the h2 title "Selection plugin"
    test("2. Grab the h2 title: Selection plugin", async ({ page }) => {
        const SelectionPluginTitle = page.getByRole("heading", {
            name: "Selection plugin",
            level: 2,
        });
        await expect(SelectionPluginTitle).toBeVisible();

        await expect(SelectionPluginTitle).toHaveText("Selection plugin");
    });

    // Grad the h2 title "Lerna"
    test("3. Grab the h2 title: Lerna", async ({ page }) => {
        const LernaTitle = page.getByRole("heading", {
            name: "Lerna",
            level: 2,
        });
        await expect(LernaTitle).toBeVisible();

        await expect(LernaTitle).toHaveText("Lerna");
    });

    test("4. Grab the h2 title: Table width algorithm", async ({ page }) => {
        const TableWidthAlgorithmTitle = page.getByRole("heading", {
            name: "Table width algorithm",
            level: 2,
        });
        await expect(TableWidthAlgorithmTitle).toBeVisible();

        await expect(TableWidthAlgorithmTitle).toHaveText(
            "Table width algorithm",
        );
    });
});

test.describe("Clicks all links on the blog post page: Grid.js v3", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);

        const GridjsLink = page
            .getByRole("link", {
                name: "Grid.js v3",
            })
            .nth(1);

        await expect(GridjsLink).toBeVisible();

        await GridjsLink.click();
        await page.waitForURL(/.*\/blog\/gridjs-v3/);
    });

    test("1. The Github links of the author: Afshin Mehrabani", async ({
        page,
    }) => {
        const Authorlink = page
            .getByRole("link", {
                name: "Afshin Mehrabani",
            })
            .nth(1);
        await expect(Authorlink).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            Authorlink.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL("https://github.com/afshinm");
    });

    test("2. selection plugin here", async ({ page }) => {
        const link = page.getByRole("link", { name: "selection plugin here" });
        await expect(link).toBeVisible();

        await link.click();

        // Page Not Found
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/plugins/selection/index",
        );

        const h1title = page.getByRole("heading", {
            name: "Page Not Found",
            level: 1,
        });
        await expect(h1title).toBeVisible();
        await expect(h1title).toHaveText("Page Not Found");
    });

    test("3. Lerna", async ({ page }) => {
        const link = page.getByRole("link", { name: "Lerna" }).first();
        await expect(link).toBeVisible();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL("https://lerna.js.org/");
    });
});
