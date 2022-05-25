import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

test.describe('Offline Mode', () => {
	let page: Page

	test.beforeEach(async ({ browser }) => {
		const ctx = await browser.newContext()
		page = await browser.newPage()

		// Go to http://localhost:3000/
		await page.goto('http://localhost:3000/')

		// Click text=
		await page.locator('text=').click()

		// Click [placeholder="Enter Email"]
		await page.locator('[placeholder="Enter Email"]').click()

		// Fill [placeholder="Enter Email"]
		await page.locator('[placeholder="Enter Email"]').fill('admin@curamericas.com')

		// Press Tab
		await page.locator('[placeholder="Enter Email"]').press('Tab')

		// Fill [placeholder="Enter Password"]
		await page.locator('[placeholder="Enter Password"]').fill('test')

		// Click button:has-text("Login")
		await Promise.all([
			page.waitForNavigation(/*{ url: 'http://localhost:3000/' }*/),
			page.locator('button:has-text("Login")').click()
		])

		await page.evaluate(() => {
			window.localStorage.setItem('isOffline', 'true')
		})
	})

	test.afterAll(async () => {
		await page.close()
	})

	test('Offline mode icon visible in top nav', async () => {
		await expect(await page.locator('#offline-mode-icon')).toHaveCount(1)
	})

	test('Make sure offline mode shows in new request menu', async () => {
		// Click text=New Request
		await page.locator('text=New Request').click()

		await expect(
			page.locator(
				'text=You are currently offline. This record will be stored on your device and sync au'
			)
		).toHaveCount(1)
	})

	test('New clients show offline mode text', async () => {
		// Click text=New Client
		await page.locator('text=New Client').click()

		// await page.pause()

		await expect(
			page.locator(
				'text=You are currently offline. This record will be stored on your device and sync au'
			)
		).toHaveCount(1)
	})

	test('Specialists table shows offline mode', async () => {
		await page.route('**/graphql', (route) => route.abort())

		await page.goto('http://localhost:3000/specialist')

		await expect(
			await page.locator(
				'text=Connect to the InternetYou are offline. You can add data but must reconnect to s'
			)
		).toHaveCount(1)
	})

	test('Clients table shows offline mode', async () => {
		await page.route('**/graphql', (route) => route.abort())

		await page.goto('http://localhost:3000/clients')

		await expect(
			await page.locator(
				'text=Connect to the InternetYou are offline. You can add data but must reconnect to s'
			)
		).toHaveCount(1)
	})

	test('Reporting table shows offline mode', async () => {
		await page.route('**/graphql', (route) => route.abort())

		await page.goto('http://localhost:3000/reporting')

		await expect(
			await page.locator(
				'text=Connect to the InternetYou are offline. You can add data but must reconnect to s'
			)
		).toHaveCount(1)
	})

	test('Offline mode message appears in specialists table create', async () => {
		await page.route('**/graphql', (route) => route.abort())

		await page.locator('text=Specialists').click()
		await expect(page).toHaveURL('http://localhost:3000/specialist')

		// Click button:has-text("Add Specialist")
		await page.locator('button:has-text("Add Specialist")').click()

		// Click text=You are currently offline. This record will be stored on your device and sync au
		await expect(
			await page.locator(
				'text=You are currently offline. This record will be stored on your device and sync au'
			)
		).toHaveCount(1)
	})
})
