/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { act } from 'react-dom/test-utils'
import { waitFor, fireEvent } from '@testing-library/react'

export async function navigateDashboard(container: Element): Promise<void> {
	await navigate(container, '/', () => {
		// Main Body Content Rendered
		expect(container.querySelector(`[data-testid="flyout-panels"]`)).toBeTruthy()
		expect(container.querySelector(`[data-testid="my-requests-list"]`)).toBeTruthy()
		expect(container.querySelector(`[data-testid="requests-list"]`)).toBeTruthy()
		expect(container.querySelector(`[data-testid="inactive-requests-list"]`)).toBeTruthy()
	})
}
export async function navigateServices(container: Element): Promise<void> {
	await navigate(container, '/services', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		expect(containers).toHaveLength(2)
		expect(container.querySelector(`[data-testid="service-list"]`)).toBeTruthy()
		expect(container.querySelector(`[data-testid="flyout-panels"]`)).toBeTruthy()
	})
}
export async function navigateSpecialists(container: Element): Promise<void> {
	await navigate(container, '/specialist', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		expect(container.querySelector(`[data-testid="flyout-panels"]`)).toBeTruthy()
		expect(container.querySelector(`[data-testid="specialist-list"]`)).toBeTruthy()
		expect(containers).toHaveLength(2)
	})
}
export async function navigateClients(container: Element): Promise<void> {
	await navigate(container, '/clients', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		expect(container.querySelector(`[data-testid="contact-list"]`)).toBeTruthy()
		expect(container.querySelector(`[data-testid="flyout-panels"]`)).toBeTruthy()
		expect(containers).toHaveLength(2)
	})
}
export async function navigateTags(container: Element): Promise<void> {
	await navigate(container, '/tags', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		expect(container.querySelector(`[data-testid="tags-list"]`)).toBeTruthy()
		expect(containers).toHaveLength(2)
	})
}
export async function navigateReporting(container: Element): Promise<void> {
	await navigate(container, '/reporting', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		expect(container.querySelector(`[data-testid="report-list"]`)).toBeTruthy()
		expect(containers).toHaveLength(2)
	})
}
async function navigate(container: Element, href: string, condition: () => void): Promise<void> {
	const link = container.querySelector(`a[href="${href}"]`)
	if (link == null) {
		throw new Error(`could not find link with href ${href}`)
	}
	expect(link).toBeTruthy()
	await act(async () => {
		fireEvent.click(link)
		await waitFor(condition, { timeout: 10000 })
	})
}
