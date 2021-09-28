/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { act } from 'react-dom/test-utils'
import { waitFor, fireEvent } from '@testing-library/react'

export async function navigateDashboard(container: Element): Promise<void> {
	await navigate(container, '/', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		if (!containers) {
			throw new Error('could not find containers in dashboard')
		}
		expect(containers).toHaveLength(2)
	})
}
export async function navigateServices(container: Element): Promise<void> {
	await navigate(container, '/services', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		if (!containers) {
			throw new Error('could not find containers in services')
		}
		expect(containers).toHaveLength(2)
	})
}
export async function navigateSpecialists(container: Element): Promise<void> {
	await navigate(container, '/specialist', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		if (!containers) {
			throw new Error('could not find containers in specialist')
		}
		expect(containers).toHaveLength(2)
	})
}
export async function navigateClients(container: Element): Promise<void> {
	await navigate(container, '/clients', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		if (!containers) {
			throw new Error('could not find containers in clients')
		}
		expect(containers).toHaveLength(2)
	})
}
export async function navigateTags(container: Element): Promise<void> {
	await navigate(container, '/tags', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		if (!containers) {
			throw new Error('could not find containers in tags')
		}
		expect(containers).toHaveLength(2)
	})
}
export async function navigateReporting(container: Element): Promise<void> {
	await navigate(container, '/reporting', () => {
		const containers = document.querySelectorAll('.container > .row > .col')
		if (!containers) {
			throw new Error('could not find containers in reporting')
		}
		expect(containers).toHaveLength(2)
	})
}
async function navigate(container: Element, href: string, condition: () => void): Promise<void> {
	const link = container.querySelector(`a[href="${href}"]`)
	if (link == null) {
		throw new Error(`could not find link with href ${href}`)
	}
	expect(link).toBeDefined()
	await act(async () => {
		fireEvent.click(link)
		await waitFor(condition, { timeout: 5000 })
	})
}
