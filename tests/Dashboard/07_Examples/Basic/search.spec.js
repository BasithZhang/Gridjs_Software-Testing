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

    test("When search is set to true", async ({ page }) => {
        const firstGridContainer = page.locator(".gridjs-container").first();
        const searchInput = firstGridContainer.locator(
            "input.gridjs-search-input",
        );
        const tableBody = firstGridContainer.locator(
            "table.gridjs-table tbody",
        );

        // 1. 確保搜尋框可見
        await expect(searchInput).toBeVisible();

        // 2. 輸入 'john' (模擬使用者真實打字行為)
        await searchInput.fill("john");

        // 3. 驗證正向結果：應該只剩下一行，且包含 'John'
        // 注意：Grid.js 搜尋反應很快，Playwright 的 expect 會自動 retry 等待 DOM 變更
        const rows = tableBody.locator("tr");
        await expect(rows).toHaveCount(1);
        await expect(rows.first()).toContainText("John");

        // 4. 驗證負向結果：確認其他名字已被過濾掉 (Filtered Out)
        // 我們檢查 tbody 容器內是否"不包含"這些文字
        await expect(tableBody).not.toContainText("Mark");
        await expect(tableBody).not.toContainText("Eoin");
        await expect(tableBody).not.toContainText("Nisen");

        // 替代寫法 (針對特定元素的更嚴格檢查)：
        // 確保找不到含有這些文字的儲存格
        await expect(
            firstGridContainer.getByRole("cell", { name: "Mark" }),
        ).toBeHidden();
        await expect(
            firstGridContainer.getByRole("cell", { name: "Eoin" }),
        ).toBeHidden();
        await expect(
            firstGridContainer.getByRole("cell", { name: "Nisen" }),
        ).toBeHidden();
    });

    test("When search is set to false", async ({ page }) => {
        // 1. 定位編輯器
        const codeEditor = page
            .locator("textarea.npm__react-simple-code-editor__textarea")
            .first();

        const codeBody = `
        const grid = new Grid({
          columns: ['Name', 'Email', 'Phone Number'],
          search: false,
          data: [
            ['John', 'john@example.com', '(353) 01 222 3333'],
            ['Mark', 'mark@gmail.com', '(01) 22 888 4444'],
            ['Eoin', 'eo3n@yahoo.com', '(05) 10 878 5554'],
            ['Nisen', 'nis900@gmail.com', '313 333 1923']
          ]
        })`.trim(); // 注意：這裡故意拿掉最後的分號與右括號

        // 3. 操作編輯器
        await codeEditor.click();
        await codeEditor.focus();

        // 清空舊內容
        const modifier = process.platform === "darwin" ? "Meta" : "Control";
        await page.keyboard.press(`${modifier}+A`);
        await page.keyboard.press("Backspace");

        // 4. 混合輸入策略
        // Step A: 使用 fill 快速填入主體 (保持格式整齊，不會觸發自動縮排混亂)
        await codeEditor.fill(codeBody);

        // Step B: 手動輸入結尾符號 (模擬真實打字，強制觸發編輯器的 Run/Compile)
        // 我們輸入最後的 "; " (分號與空格)，這能確保語法封閉並觸發更新
        await codeEditor.type(";", { delay: 100 });

        // 5. 驗證結果
        const firstGridContainer = page.locator(".gridjs-container").first();
        const searchInput = firstGridContainer.locator(
            "input.gridjs-search-input",
        );

        // 斷言：Search Box 應該消失 (search: false)
        await expect(searchInput).toBeHidden();

        // 斷言：表格本身應該還在 (確認程式碼有效且已渲染)
        await expect(
            firstGridContainer.locator("table.gridjs-table"),
        ).toBeVisible();
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
        const link = page.getByRole("link", { name: "Examples" }).nth(2);
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
