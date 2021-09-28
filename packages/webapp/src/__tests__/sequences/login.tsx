/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import config from 'config'
import { act } from 'react-dom/test-utils'
import { waitFor, fireEvent } from '@testing-library/react'

const EMAIL = config.get<string>('integrationtest.username')
const PASSWORD = config.get<string>('integrationtest.password')

/**
 * Executes a sequence of logging into the system
 * @param container The app container element
 * @param email optional - the email to use
 * @param password optional - the password to use
 */
export async function login(container: Element, email = EMAIL, password = PASSWORD): Promise<void> {
	const consentForm = container.querySelector(`.ms-Checkbox-text`)
	const emailField = container.querySelector(`[data-testid="login_email"]`) as HTMLInputElement
	const passwordField = container.querySelector(
		`[data-testid="login_password"]`
	) as HTMLInputElement
	const loginButton = container.querySelector(`[data-testid="login_button"]`)
	expect(consentForm).toBeDefined()
	expect(emailField).toBeDefined()
	expect(passwordField).toBeDefined()
	expect(loginButton).toBeDefined()

	// Step 1: Agree to Consent Form
	act(() => {
		fireEvent.click(consentForm)
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
				expect(container.innerHTML.indexOf('Hello, Chris')).toBeGreaterThan(-1)
			},
			{ timeout: 5000 }
		)
	})
}
