/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import config from 'config'
import { act } from 'react-dom/test-utils'
import { waitFor, fireEvent } from '@testing-library/react'
import {
	getConsentCheckbox,
	getEmailField,
	getFlyoutPanels,
	getInactiveRequestsList,
	getLoginButton,
	getMyRequestsList,
	getPasswordField,
	getRequestsList
} from './domComponents'

const EMAIL = config.get<string>('integrationtest.username')
const PASSWORD = config.get<string>('integrationtest.password')

/**
 * Executes a sequence of logging into the system
 * @param container The app container element
 * @param email optional - the email to use
 * @param password optional - the password to use
 */
export async function login(email = EMAIL, password = PASSWORD): Promise<void> {
	const consentCheckbox = getConsentCheckbox()
	const emailField = getEmailField()
	const passwordField = getPasswordField()
	const loginButton = getLoginButton()

	expect(consentCheckbox).toBeTruthy()
	expect(emailField).toBeTruthy()
	expect(passwordField).toBeTruthy()
	expect(loginButton).toBeTruthy()

	// Step 1: Agree to Consent Form
	act(() => {
		fireEvent.click(consentCheckbox)
	})
	// Step 2: Enter Email & Password
	act(() => {
		fireEvent.change(emailField, { target: { value: email } })
		fireEvent.change(passwordField, { target: { value: password } })
	})
	// Step 3: Hit Login Button
	await act(async () => {
		fireEvent.click(loginButton)
		await waitFor(
			() => {
				// Login Content goes Away
				expect(getEmailField()).toBeFalsy()
				// Main Body Content Rendered
				expect(getFlyoutPanels()).toBeTruthy()
				expect(getMyRequestsList()).toBeTruthy()
				expect(getRequestsList()).toBeTruthy()
				expect(getInactiveRequestsList()).toBeTruthy()
			},
			{ timeout: 5000 }
		)
	})
}
