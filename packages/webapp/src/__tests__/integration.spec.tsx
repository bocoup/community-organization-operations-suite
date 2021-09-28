/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { App } from '~components/app'
import { waitFor, fireEvent } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import fetch from 'cross-fetch'
import config from 'config'
import englishLocalization from '../../dist/localizations/en-US.json'
import spanishLocalization from '../../dist/localizations/es-US.json'
import { act } from 'react-dom/test-utils'
import { render, unmountComponentAtNode } from 'react-dom'
import debug from 'debug'
const logger = debug('cbosuite:integration_tests')

const EMAIL = config.get<string>('integrationtest.username')
const PASSWORD = config.get<string>('integrationtest.password')

describe('The CBOSuite App', () => {
	let container: HTMLDivElement

	beforeEach(async () => {
		// Set up React Host
		container = document.createElement('div')
		document.body.appendChild(container)

		// Set up HTTP Mocking
		fetchMock.mockResponse(async (req) => {
			if (req.url === '/localizations/en-US.json') {
				return JSON.stringify(englishLocalization)
			} else if (req.url === '/localizations/es-US.json') {
				return JSON.stringify(spanishLocalization)
			} else {
				logger('Outbound request', req.url)
				return fetch(req) as any
			}
		})
	})
	afterEach(async () => {
		unmountComponentAtNode(container)
		container.remove()
		container = null
		fetchMock.resetMocks()
	})

	it('can go through login flow', async () => {
		await act(async () => {
			render(<App />, container)
			await waitFor(() => {
				expect(container.innerHTML.length).toBeGreaterThan(0)
			})
		})

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
			fireEvent.change(emailField, { target: { value: EMAIL } })
			fireEvent.change(passwordField, { target: { value: PASSWORD } })
		})
		// Step 3: Hit Login Button
		await act(async () => {
			fireEvent.click(loginButton)
			await waitFor(
				() => {
					expect(container.innerHTML.indexOf('Test CBO')).toBeGreaterThan(-1)
				},
				{ timeout: 5000 }
			)
		})
	}, 30000)
})
