import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/examples/fixed-header";

test.describe("Fixed Header example page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(url);
    await expect(page).toHaveURL(url);
  });

  test("has h1 title 'Fixed Header'", async ({ page }) => {
    const title = page.getByRole("heading", { name: "Fixed Header", level: 1 });
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

  test("header stays visible when table content scrolls", async ({ page }) => {
    const container = page.locator(".gridjs-wrapper");
    await expect(container).toBeVisible();

    const scrollable = await container.evaluate((el) => el.scrollHeight > el.clientHeight);
    expect(scrollable).toBeTruthy();

    await container.evaluate((el) => { el.scrollTop = 200; });
    const headerName = page.locator('th[data-column-id="name"]');
    await expect(headerName).toBeVisible();
  });

  test("pagination shows 10 rows per page", async ({ page }) => {
    const rows = page.locator(".gridjs-container table tbody tr");
    await expect(rows).toHaveCount(10);
  });

  test("pagination navigates to page 2 and changes rows", async ({ page }) => {
    const firstRow = page.locator(".gridjs-container table tbody tr").first();
    const before = (await firstRow.textContent())?.trim();

    const pageTwoBtn = page.locator(".gridjs-pages").getByRole("button", { name: "2" });
    await expect(pageTwoBtn).toBeVisible();
    await pageTwoBtn.click();

    const afterRow = page.locator(".gridjs-container table tbody tr").first();
    await expect(afterRow).not.toHaveText(before || "");
  });

  test("sorting by Name toggles ascending/descending", async ({ page }) => {
    const sortBtn = page.locator('th[data-column-id="name"] button.gridjs-sort');
    await expect(sortBtn).toBeVisible();

    const getNames = async () => {
      return await page.locator(".gridjs-wrapper table tbody tr td:nth-child(1)").allTextContents();
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

  test("header position sticks to container top on scroll", async ({ page }) => {
    const container = page.locator(".gridjs-wrapper");
    const header = page.locator(".gridjs-wrapper thead");

    const { top: cTop } = await container.evaluate(el => el.getBoundingClientRect());
    const { top: hTopBefore } = await header.evaluate(el => el.getBoundingClientRect());

    await container.evaluate(el => { el.scrollTop = 250; });

    const { top: hTopAfter } = await header.evaluate(el => el.getBoundingClientRect());
    expect(Math.abs(hTopBefore - cTop)).toBeLessThan(3);
    expect(Math.abs(hTopAfter - cTop)).toBeLessThan(3);
  });
});
