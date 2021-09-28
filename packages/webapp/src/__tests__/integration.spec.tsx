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
const logger = debug('cbosuite:integration_tests')

describe('The CBOSuite App', () => {
	let container: HTMLDivElement

	beforeEach(async () => {
		// Set up React Host
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
	afterEach(async () => {
		unmountComponentAtNode(container)
		container.remove()
		container = null
		fetchMock.resetMocks()
	})

	it('can go through login flow', async () => {
		await mount(container)
		await login(container)
	}, 10000)
})
