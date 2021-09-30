/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { act } from 'react-dom/test-utils'
import { waitFor, fireEvent } from '@testing-library/react'
import {
	getContactList,
	getFlyoutPanels,
	getInactiveRequestsList,
	getMyRequestsList,
	getReportList,
	getRequestsList,
	getServiceList,
	getSpecialistList,
	getTagList
} from './domComponents'

export async function navigateDashboard(): Promise<void> {
	await navigate('/', () => {
		// Main Body Content Rendered
		expect(getFlyoutPanels()).toBeTruthy()
		expect(getMyRequestsList()).toBeTruthy()
		expect(getRequestsList()).toBeTruthy()
		expect(getInactiveRequestsList()).toBeTruthy()
	})
}
export async function navigateServices(): Promise<void> {
	await navigate('/services', () => {
		expect(getServiceList()).toBeTruthy()
		expect(getFlyoutPanels()).toBeTruthy()
	})
}
export async function navigateSpecialists(): Promise<void> {
	await navigate('/specialist', () => {
		expect(getFlyoutPanels()).toBeTruthy()
		expect(getSpecialistList()).toBeTruthy()
	})
}
export async function navigateClients(): Promise<void> {
	await navigate('/clients', () => {
		expect(getContactList()).toBeTruthy()
		expect(getFlyoutPanels()).toBeTruthy()
	})
}
export async function navigateTags(): Promise<void> {
	await navigate('/tags', () => {
		expect(getTagList()).toBeTruthy()
	})
}
export async function navigateReporting(): Promise<void> {
	await navigate('/reporting', () => {
		expect(getReportList()).toBeTruthy()
	})
}
async function navigate(href: string, condition: () => void): Promise<void> {
	const link = document.querySelector(`a[href="${href}"]`)
	if (link == null) {
		throw new Error(`could not find link with href ${href}`)
	}
	expect(link).toBeTruthy()
	await act(async () => {
		fireEvent.click(link)
		await waitFor(condition, { timeout: 10000 })
	})
}
