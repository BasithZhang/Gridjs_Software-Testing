import { test, expect } from "@playwright/test";

const url = "http://localhost:3000/docs/localization/locales";

test.describe("Grab titles in the Localization page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Grab the h1 title: Locales", async ({ page }) => {
        const title = page.getByRole("heading", { name: "Locales", level: 1 });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Locales");
    });

    test("Grab the h2 title: Installing a Locale", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Installing a Locale",
            level: 2,
        });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Installing a Locale");
    });

    test("Grab the listitems", async ({ page }) => {
        // Not sure why there are two "tr_TR" in the list 0-0
        const items = [
            "ar_SA",
            "cn_CN",
            "de_De",
            "en_US",
            "es_ES",
            "fa_IR",
            "fr_FR",
            "id_ID",
            "it_IT",
            "tr_TR",
            "ja_JP",
            "ko_KR",
            "nb_NO",
            "pt_BR",
            "pt_PT",
            "ru_RU",
            "tr_TR",
            "ua_UA",
        ];

        var tr_count = 0;

        for (const item of items) {
            if (item === "tr_TR") {
                const listitem = page
                    .getByRole("listitem")
                    .filter({ hasText: item })
                    .nth(tr_count);
                await expect(listitem).toBeVisible();
                await expect(listitem).toHaveText(item);
                tr_count++;
            } else {
                const listitem = page
                    .getByRole("listitem")
                    .filter({ hasText: item });
                await expect(listitem).toBeVisible();
                await expect(listitem).toHaveText(item);
            }
        }
    });

    test("Grab the h2 title: Creating a Locale", async ({ page }) => {
        const title = page.getByRole("heading", {
            name: "Creating a Locale",
            level: 2,
        });
        await expect(title).toBeVisible();
        await expect(title).toHaveText("Creating a Locale");
    });
});

test.describe("Check the links in the localozation page", async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(url);
        await expect(page).toHaveURL(url);
    });

    test("Check the link: Installing a Locale", async ({ page }) => {
        const link = page.getByRole("link", { name: "Installing a Locale" });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/localization/locales#installing-a-locale",
        );
    });

    test("Check the link: Creating a Locale", async ({ page }) => {
        const link = page.getByRole("link", { name: "Creating a Locale" });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/localization/locales#creating-a-locale",
        );
    });

    test("Check the link: en_US", async ({ page }) => {
        const link = page.getByRole("link", { name: "en_US" });
        await expect(link).toBeVisible();
        await link.click();

        const [newPage] = await Promise.all([
            page.context().waitForEvent("page"),
            link.click(),
        ]);

        await newPage.waitForLoadState();

        await expect(newPage).toHaveURL(
            "https://github.com/grid-js/gridjs/blob/master/src/i18n/en_US.ts",
        );
    });

    test("Check the link: Previous << jQuery", async ({ page }) => {
        const link = page.getByRole("link", { name: /Previous.*jQuery/ });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/integrations/jquery",
        );
    });

    test("Check the link: Next Hello, World! >>", async ({ page }) => {
        const link = page.getByRole("link", { name: /Next Hello, World!.*/ });
        await expect(link).toBeVisible();
        await link.click();
        await expect(page).toHaveURL(
            "http://localhost:3000/docs/examples/hello-world",
        );
    });
});

// TODO: The table in the "Installing a Locale" section also has the same issue as the homepage one!
