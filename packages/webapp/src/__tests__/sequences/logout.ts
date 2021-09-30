/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { act, waitFor, fireEvent } from '@testing-library/react'
import { getLogoutButton, getPersonaButton } from './domComponents'

export async function logout(): Promise<void> {
	// Step 1: Click Persona Button
	const personaButton = getPersonaButton()
	expect(personaButton).toBeTruthy()
	await act(async () => {
		fireEvent.click(personaButton)
		await waitFor(
			() => {
				expect(getLogoutButton()).toBeTruthy()
			},
			{ timeout: 1000 }
		)
	})
	// Step 2: Click Logout Button
	await act(async () => {
		const logoutButton = getLogoutButton()
		expect(logoutButton).toBeTruthy()
		fireEvent.click(logoutButton)
		await waitFor(
			() => {
				// TODO: investigate why the UI doesn't swap over here
				//expect(getLoginButton()).toBeTruthy()
			},
			{ timeout: 2000 }
		)
	})
}
