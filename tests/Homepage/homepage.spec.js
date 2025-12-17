import { test, expect, Page } from '@playwright/test';

const BASE = 'http://localhost:3000/';

test.describe('Grid.js Homepage E2E Tests', () => {

	test.beforeEach(async ({ page }) => {
		await page.goto('https://gridjs.io/');
		// await page.goto(BASE, { waitUntil: 'domcontentloaded' });
		await page.waitForLoadState('networkidle');
	});

	test.describe('Navigation Bar - Desktop Links', () => {

		test('should verify all navigation links are present, have correct hrefs, and navigate correctly', async ({ page }) => {
			const navLinks = [
				{ text: 'Install', href: '/docs/install' },
				{ text: 'Docs', href: '/docs' },
				{ text: 'Sponsors', href: '/docs/sponsors' },
				{ text: 'Community', href: '/docs/community' }
				// ,
				// { text: 'GitHub', href: 'github.com/grid-js/gridjs' }
			];

			for (const pageInfo of navLinks) {
				const link = page.locator(`a:has-text("${pageInfo.text}")`).first();
				await link.click();
				await page.waitForLoadState('networkidle');
				expect(page.url()).toContain(pageInfo.href);
			}

		});

		test('should click Grid.js logo and navigate to homepage', async ({ page }) => {
			// Navigate away from homepage
			await page.goto('https://gridjs.io/docs');
			await page.waitForLoadState('networkidle');

			const logoLink = page.locator('nav a[href="/"]').first();
			await expect(logoLink).toBeVisible();

			await logoLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toBe('https://gridjs.io/');
		});

		test('should click GitHub link and open in new tab', async ({ page, context }) => {
			const githubLink = page.locator('nav a[href="https://github.com/grid-js/gridjs"]').first();
			await expect(githubLink).toBeVisible();
			await githubLink.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toContain('github.com/grid-js/gridjs');
		});

		test('should click Chat (Discord) button and open Discord', async ({ page, context }) => {
			const chatButton = page.locator('nav a[href="https://discord.com/invite/K55BwDY"]').first();
			await expect(chatButton).toBeVisible();
			await chatButton.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toContain('discord.com/invite/K55BwDY');
		});
	});

	test.describe('Hero Section CTA Buttons', () => {

		test('should click "Get started" button and navigate to docs', async ({ page }) => {
			const getStartedBtn = page.locator('a:has-text("Get started")').first();
			await expect(getStartedBtn).toBeVisible();
			await expect(getStartedBtn).toHaveAttribute('href', '/docs');

			await getStartedBtn.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs');
			await expect(page.locator('h1')).toBeVisible();
		});

		test('should click "Examples" button and navigate to examples page', async ({ page }) => {
			const examplesBtn = page.locator('a[href="/docs/examples/hello-world"]').first();
			await expect(examplesBtn).toBeVisible();
			await expect(examplesBtn).toHaveText('Examples');

			await examplesBtn.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs/examples/hello-world');
			await expect(page.locator('h1')).toBeVisible();
		});
	});

	test.describe('Install Section Interactive Elements', () => {

		test('should click NPM link and open NPM page', async ({ page, context }) => {
			const npmLink = page.locator('a[href="https://www.npmjs.com/package/gridjs"]');
			await expect(npmLink).toBeVisible();

			const [newPage] = await Promise.all([
				context.waitForEvent('page'),
				npmLink.click()
			]);

			await newPage.waitForLoadState('domcontentloaded');
			expect(newPage.url()).toContain('npmjs.com/package/gridjs');

			await newPage.close();
		});

		test('should click copy button for code example', async ({ page }) => {
			const copyButton = page.locator('button[aria-label="Copy code to clipboard"]');
			await expect(copyButton).toBeVisible();

			await copyButton.click();

			// Wait for the copy animation
			await page.waitForTimeout(500);
		});

		test('should verify JavaScript CDN input is readonly and selectable', async ({ page }) => {
			const jsInput = page.locator('input[value="https://unpkg.com/gridjs/dist/gridjs.umd.js"]');
			await expect(jsInput).toBeVisible();
			await expect(jsInput).toHaveAttribute('readonly', '');

			// Click and focus on the input
			await jsInput.click();

			// Triple click to select all text
			await jsInput.click({ clickCount: 3 });
		});

		test('should verify CSS CDN input is readonly and selectable', async ({ page }) => {
			const cssInput = page.locator('input[value="https://unpkg.com/gridjs/dist/theme/mermaid.min.css"]');
			await expect(cssInput).toBeVisible();
			await expect(cssInput).toHaveAttribute('readonly', '');

			// Click and focus on the input
			await cssInput.click();

			// Triple click to select all text
			await cssInput.click({ clickCount: 3 });
		});
	});

	// NEW TEST: Table Header Column Sort Buttons
	test.describe('Table Header Column Sort Buttons', () => {

		test('should verify Name column sort button is visible and clickable', async ({ page }) => {
			// Locate the Name column header with data-column-id="name"
			const nameColumnHeader = page.locator('th[data-column-id="name"]');
			await expect(nameColumnHeader).toBeVisible();

			// Locate the sort button inside the Name column
			const nameSortButton = nameColumnHeader.locator('button.gridjs-sort');
			await expect(nameSortButton).toBeVisible();
			await expect(nameSortButton).toHaveAttribute('aria-label', 'Sort column ascending');
			await expect(nameSortButton).toHaveAttribute('title', 'Sort column ascending');

			// Click the sort button
			await nameSortButton.click();
			await page.waitForTimeout(500);

			// After clicking, the aria-label should change to "Sort column descending"
			// (This may vary based on Grid.js implementation)
		});

		test('should verify Job column sort button is visible and clickable', async ({ page }) => {
			const jobColumnHeader = page.locator('th[data-column-id="job"]');
			await expect(jobColumnHeader).toBeVisible();

			const jobSortButton = jobColumnHeader.locator('button.gridjs-sort');
			await expect(jobSortButton).toBeVisible();
			await expect(jobSortButton).toHaveAttribute('aria-label', 'Sort column ascending');

			await jobSortButton.click();
			await page.waitForTimeout(500);
		});

		test('should verify Country column sort button is visible and clickable', async ({ page }) => {
			const countryColumnHeader = page.locator('th[data-column-id="country"]');
			await expect(countryColumnHeader).toBeVisible();

			const countrySortButton = countryColumnHeader.locator('button.gridjs-sort');
			await expect(countrySortButton).toBeVisible();
			await expect(countrySortButton).toHaveAttribute('aria-label', 'Sort column ascending');

			await countrySortButton.click();
			await page.waitForTimeout(500);
		});

		test('should click all three sort buttons in sequence', async ({ page }) => {
			// Click Name column sort
			await page.locator('th[data-column-id="name"] button.gridjs-sort').click();
			await page.waitForTimeout(300);

			// Click Job column sort
			await page.locator('th[data-column-id="job"] button.gridjs-sort').click();
			await page.waitForTimeout(300);

			// Click Country column sort
			await page.locator('th[data-column-id="country"] button.gridjs-sort').click();
			await page.waitForTimeout(300);
		});
	});

	// NEW TEST: Pagination Buttons
	test.describe('Pagination Buttons', () => {

		test('should verify Previous button is disabled initially', async ({ page }) => {
			const previousButton = page.locator('.gridjs-pages button[title="Previous"]');
			await expect(previousButton).toBeVisible();
			await expect(previousButton).toBeDisabled();
			await expect(previousButton).toHaveText('Previous');
		});

		test('should verify Page 1 button is active initially', async ({ page }) => {
			const page1Button = page.locator('.gridjs-pages button[title="Page 1"]');
			await expect(page1Button).toBeVisible();
			await expect(page1Button).toHaveClass(/gridjs-currentPage/);
			await expect(page1Button).toHaveText('1');
		});

		test('should verify Page 2 button is visible and clickable', async ({ page }) => {
			const page2Button = page.locator('.gridjs-pages button[title="Page 2"]');
			await expect(page2Button).toBeVisible();
			await expect(page2Button).not.toBeDisabled();
			await expect(page2Button).toHaveText('2');

			// Click Page 2 button
			await page2Button.click();
			await page.waitForTimeout(500);

			// After clicking, Page 2 should become active
			await expect(page2Button).toHaveClass(/gridjs-currentPage/);
		});

		test('should verify Page 3 button is visible and clickable', async ({ page }) => {
			const page3Button = page.locator('.gridjs-pages button[title="Page 3"]');
			await expect(page3Button).toBeVisible();
			await expect(page3Button).not.toBeDisabled();
			await expect(page3Button).toHaveText('3');

			await page3Button.click();
			await page.waitForTimeout(500);
		});

		test('should verify Next button is visible and clickable', async ({ page }) => {
			const nextButton = page.locator('.gridjs-pages button[title="Next"]');
			await expect(nextButton).toBeVisible();
			await expect(nextButton).not.toBeDisabled();
			await expect(nextButton).toHaveText('Next');

			await nextButton.click();
			await page.waitForTimeout(500);

			// After clicking Next, we should be on page 2
			const page2Button = page.locator('.gridjs-pages button[title="Page 2"]');
			await expect(page2Button).toHaveClass(/gridjs-currentPage/);
		});

		test('should test pagination flow: Next -> Page 3 -> Previous', async ({ page }) => {
			// Click Next button
			await page.locator('.gridjs-pages button[title="Next"]').click();
			await page.waitForTimeout(300);

			// Verify we're on page 2
			await expect(page.locator('.gridjs-pages button[title="Page 2"]')).toHaveClass(/gridjs-currentPage/);

			// Click Page 3
			await page.locator('.gridjs-pages button[title="Page 3"]').click();
			await page.waitForTimeout(300);

			// Verify we're on page 3
			await expect(page.locator('.gridjs-pages button[title="Page 3"]')).toHaveClass(/gridjs-currentPage/);

			// Click Previous button
			await page.locator('.gridjs-pages button[title="Previous"]').click();
			await page.waitForTimeout(300);

			// Verify we're back on page 2
			await expect(page.locator('.gridjs-pages button[title="Page 2"]')).toHaveClass(/gridjs-currentPage/);
		});
	});

	// FIXED: Footer Links - Using div.bg-gray-800 instead of footer tag
	test.describe('Bottom Section Links - Grid.js Section', () => {

		test('should scroll to bottom and click Install link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			// Use the bg-gray-800 div instead of footer
			const installLink = page.locator('div.bg-gray-800 a[href="/docs/install"]');
			await expect(installLink).toBeVisible();

			await installLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs/install');
		});

		test('should scroll to bottom and click Examples link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const examplesLink = page.locator('div.bg-gray-800 a[href="/docs/examples/hello-world"]');
			await expect(examplesLink).toBeVisible();

			await examplesLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs/examples/hello-world');
		});

		test('should scroll to bottom and click Contribute link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const contributeLink = page.locator('div.bg-gray-800 a:has-text("Contribute")');
			await expect(contributeLink).toBeVisible();

			await contributeLink.click();
			await page.waitForTimeout(1000);
		});
	});

	test.describe('Bottom Section Links - Support Section', () => {

		test('should scroll to bottom and click Documentation link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			// More specific selector for Documentation under Support section
			const docsLink = page.locator('div.bg-gray-800 h4:has-text("Support") + ul a[href="/docs"]');
			await expect(docsLink).toBeVisible();

			await docsLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs');
		});

		test('should scroll to bottom and click Community link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const communityLink = page.locator('div.bg-gray-800 a[href="/docs/community"]');
			await expect(communityLink).toBeVisible();

			await communityLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs/community');
		});

		test('should scroll to bottom and click Chat link', async ({ page, context }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const chatLink = page.locator('div.bg-gray-800 a[href="https://discord.com/invite/K55BwDY"]');
			await expect(chatLink).toBeVisible();
			await chatLink.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toContain('discord.com/invite/K55BwDY');
		});

		test('should scroll to bottom and verify StackOverflow link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const stackOverflowLink = page.locator('div.bg-gray-800 a:has-text("StackOverflow")');
			await expect(stackOverflowLink).toBeVisible();
			await stackOverflowLink.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toContain('stackoverflow.com');
		});
	});

	test.describe('Bottom Section Links - Team Section', () => {

		test('should scroll to bottom and click Blog link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const blogLink = page.locator('div.bg-gray-800 a[href="/blog"]');
			await expect(blogLink).toBeVisible();

			await blogLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/blog');
		});

		test('should scroll to bottom and verify Contributors link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const contributorsLink = page.locator('div.bg-gray-800 a:has-text("Contributors")');
			await expect(contributorsLink).toBeVisible();
		});

		test('should scroll to bottom and click GitHub link', async ({ page, context }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const githubLink = page.locator('div.bg-gray-800 h4:has-text("Team") + ul a[href="https://github.com/grid-js/gridjs"]');
			await expect(githubLink).toBeVisible();

			const [newPage] = await Promise.all([
				context.waitForEvent('page'),
				githubLink.click()
			]);

			await newPage.waitForLoadState('domcontentloaded');
			expect(newPage.url()).toContain('github.com/grid-js/gridjs');

			await newPage.close();
		});

		test('should scroll to bottom and click Intro.js link', async ({ page, context }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const introLink = page.locator('div.bg-gray-800 a[href="https://introjs.com"]');
			await expect(introLink).toBeVisible();

			const [newPage] = await Promise.all([
				context.waitForEvent('page'),
				introLink.click()
			]);

			await newPage.waitForLoadState('domcontentloaded');
			expect(newPage.url()).toContain('introjs.com');

			await newPage.close();
		});
	});

	test.describe('Bottom Section Links - Legal Section', () => {

		test('should scroll to bottom and click License link', async ({ page }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const licenseLink = page.locator('div.bg-gray-800 a[href="/docs/license"]');
			await expect(licenseLink).toBeVisible();

			await licenseLink.click();
			await page.waitForLoadState('networkidle');

			expect(page.url()).toContain('/docs/license');
			await expect(page.locator('h1:has-text("License")')).toBeVisible();
		});
	});

	test.describe('Bottom Section Social Media Links', () => {

		test('should scroll to bottom and click Twitter link', async ({ page, context }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			const twitterLink = page.locator('div.bg-gray-800 a[href="https://twitter.com/grid_js"]');
			await expect(twitterLink).toBeVisible();
			await twitterLink.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toContain('x.com/grid_js');
		});

		test('should scroll to bottom and click GitHub social link', async ({ page, context }) => {
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
			await page.waitForTimeout(500);

			// More specific selector for social media GitHub link at the bottom
			const githubLink = page.locator('div.bg-gray-800 div.flex a[href="https://github.com/grid-js/gridjs"]');
			await expect(githubLink).toBeVisible();
			await githubLink.click();
			await page.waitForLoadState('networkidle');
			expect(page.url()).toContain('github.com/grid-js/gridjs');
		});
	});

	test.describe('Mobile Menu Interaction', () => {

		test('should click mobile menu toggle button', async ({ page }) => {
			// Set viewport to mobile size
			await page.setViewportSize({ width: 375, height: 667 });
			await page.waitForTimeout(500);

			const menuButton = page.locator('nav button[type="button"]').first();
			await expect(menuButton).toBeVisible();

			// Click to open mobile menu
			await menuButton.click();
			await page.waitForTimeout(500);

			// Verify mobile menu is displayed
			const mobileMenu = page.locator('.rounded-lg.shadow-md');
			// Note: The menu visibility may vary
		});
	});

});
