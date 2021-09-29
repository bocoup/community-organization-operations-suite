/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await,jest/expect-expect */
import fetchMock from 'jest-fetch-mock'
import fetch from 'cross-fetch'
import englishLocalization from '../../dist/localizations/en-US.json'
import spanishLocalization from '../../dist/localizations/es-US.json'
import { unmountComponentAtNode } from 'react-dom'
import debug from 'debug'
import { mount } from './sequences/mount'
import { login } from './sequences/login'
import {
	navigateClients,
	navigateDashboard,
	navigateReporting,
	navigateServices,
	navigateSpecialists,
	navigateTags
} from './sequences/navigate'
const logger = debug('cbosuite:integration_tests')
const ITEST_TIMEOUT = 30000

describe('The CBOSuite App', () => {
	let container: HTMLDivElement

	beforeEach(async () => {
		// Set up React Host
		localStorage.clear()
		container = document.createElement('div')
		container.id = 'root'
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
	afterEach(() => {
		unmountComponentAtNode(container)
		container.remove()
		container = null
		localStorage.clear()
		fetchMock.resetMocks()
		jest.clearAllMocks()
	})

	it(
		'can go through login flow',
		async () => {
			await mount(container)
			await login(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to dashboard (/)',
		async () => {
			await mount(container)
			await login(container)
			await navigateDashboard(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /specialist',
		async () => {
			await mount(container)
			await login(container)
			await navigateSpecialists(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /clients',
		async () => {
			await mount(container)
			await login(container)
			await navigateClients(container)
		},
		ITEST_TIMEOUT
	)

	it(
		'can navigate to /tags',
		async () => {
			await mount(container)
			await login(container)
			await navigateTags(container)
		},
		ITEST_TIMEOUT
	)

	it.skip(
		'can navigate to /reporting',
		async () => {
			await mount(container)
			await login(container)
			await navigateReporting(container)
		},
		ITEST_TIMEOUT
	)

	it.skip(
		'can navigate to /services',
		async () => {
			await mount(container)
			await login(container)
			await navigateServices(container)
		},
		ITEST_TIMEOUT
	)
})
