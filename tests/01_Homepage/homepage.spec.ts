import { test, expect, Page } from '@playwright/test';

const BASE = 'http://localhost:3000/';
test.setTimeout(120000);

test.describe('Grid.js homepage — thorough end-to-end checks', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(BASE, { waitUntil: 'domcontentloaded' });
		// ensure network activity settles
		await page.waitForLoadState('networkidle');
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.setDefaultTimeout(5000);
		await page.setDefaultNavigationTimeout(10000);
	});

	test('page basic checks: title, hero', async ({ page }) => {
		// Title should mention Grid or Grid.js (be forgiving)
		await expect(page).toHaveTitle(/grid(\.js)?/i);

		// hero h1 or main heading exists and is visible
		const hero = page.locator('h1').first();
		await expect(hero).toBeVisible();
		// not strict text match because site copy can change; assert non-empty
		await expect(await hero.textContent()).not.toBeNull();
		expect((await hero.textContent())!.trim().length).toBeGreaterThan(0);
	});

	test('click header nav links (safe iteration)', async ({ page, context }) => {
		// Collect visible header nav anchors
		console.log('Starting header nav link test');
		const header = page.locator('header, nav').first();
		const navLinks = header.locator('a[href]').filter({ hasText: /./ }); // has text
		const count = await navLinks.count();

		for (let i = 0; i < count; i++) {
			const link = navLinks.nth(i);
			const text = (await link.textContent())?.trim() ?? '';
			const href = (await link.getAttribute('href')) ?? '';
			console.log(`Header link #${i}: "${text}" -> ${href}`);

			await link.scrollIntoViewIfNeeded();
			await Promise.all([
				page.waitForLoadState('domcontentloaded'),
				link.click({ force: true }),
			]);
			await page.goBack();
		}
	});

	test('click all visible CTA buttons and links within the main content', async ({ page, context }) => {
		// find visible buttons and anchors that look actionable within the main area
		// const main = page.locator('main').first();
		const main = (await page.locator('main').count()) > 0 ? page.locator('main') : page.locator('body');
		const clicked = new Set<string>();
		const actionable = main.locator('a[href], button, th').filter({ hasText: /./ });
		// const actionable = page.locator('a[href], button, [role=button]').filter({ hasText: /./, hasNot: page.locator('header a[href^="#"]') }); // skip purely internal anchors
		const count = Math.min(40, await actionable.count()); // limit to 30 to avoid overclicking
		console.log(`Found ${await actionable.count()} actionable elements in main; testing first ${count}`);

		for (let i = 0; i < count; i++) {
			const el = actionable.nth(i);
			const tag = await el.evaluate((n) => n.tagName.toLowerCase());
			const label = (await el.textContent())?.trim() ?? '';

			const href = (await el.getAttribute('href')) ?? '';
			const key = `${label}-${href}`;
			if (label === 'NPM' || label === 'Intro.js') continue; // skip empty text
			if (clicked.has(key)) continue;
			clicked.add(key);
			console.log(`Clicking main actionable #${i}: <${tag}> \t "${label.slice(0,40)}" \t -> ${href}`);

			if (tag === 'a') {
				await el.scrollIntoViewIfNeeded();
				await Promise.all([
				page.waitForLoadState('domcontentloaded'),
				el.click({ force: true }),
				]);
				await page.goBack();
			} 
			else {
				// button: click and wait briefly for potential UI changes (modals, toggles)
				await el.click().catch(() => null);
				await page.waitForTimeout(600); // short pause to allow UI reaction
				// if a modal opened, try to close common modal patterns
				const modalClose = page.locator('button[aria-label="Close"], button:has-text("Close"), .modal button.close').first();
				if (await modalClose.count() > 0) {
					await modalClose.click().catch(() => null);
				}
			}
		}
	});

	test('search input (if present) should return results', async ({ page }) => {
		// Many docs sites have a search input. Try to detect and use it.
		const searchSelectors = [
		'input[type="search"]',
		'input[placeholder*="Search"]',
		'input[aria-label*="Search"]',
		'.search input',
		'.searchbox input'
		];
		let found = false;
		for (const sel of searchSelectors) {
			const search = page.locator(sel).first();
			if (await search.count() > 0 && await search.isVisible()) {
				found = true;
				await search.click().catch(() => null);
				await search.fill('grid');
				// attempt enter or search button click
				await Promise.all([
				page.waitForResponse((r) => r.status() === 200, { timeout: 5000 }).catch(() => null), search.press('Enter').catch(() => null), ]);
				// check for a results container or suggestion list
				const results = page.locator('.algo-search, .search-results, .DocSearch, .ais-Hits, .search-results li').first();
				if (await results.count() > 0) {
					await expect(results).toBeVisible();
				} 
				else {
					// at least ensure page didn't show an error
					await expect(page.locator('body')).not.toContainText(/error|no results found/i);
				}
				break;
			}
		}
		console.log(`Search present: ${found}`);
		// test is non-failing if search not present; only assert if present
	});

	test('iframe demos / playground — iframes present, try interacting', async ({ page }) => {
		const iframes = page.frames();
		if (iframes.length > 1) {
			// try to find first non-main frame
			const demoFrame = page.frameLocator('iframe').first();
			const frameCount = await page.locator('iframe').count();
			console.log(`Detected ${frameCount} iframes`);
			if (frameCount > 0) {
				// click first clickable inside iframe, if any
				try {
					const buttonInFrame = demoFrame.locator('button, a').first();
					if (await buttonInFrame.count() > 0) {
						await buttonInFrame.click({ timeout: 5000 }).catch(() => null);
					}
				} 
				catch {
				// ignore cross-origin interaction errors
				}
			}
		} 
		else {
			console.log('No iframes detected (or only main frame). Skipping iframe checks.');
		}
	});


});
