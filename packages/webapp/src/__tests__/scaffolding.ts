/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import crossFetch from 'cross-fetch'
import { unmountComponentAtNode } from 'react-dom'
import fetchMock from 'jest-fetch-mock'
import englishLocalization from '../../public/localizations/en-US.json'
import spanishLocalization from '../../public/localizations/es-US.json'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('cbosuite:tests')

export function setupNetworkIntercepts() {
	fetchMock.mockResponse(async (req) => {
		if (req.url === '/localizations/en-US.json') {
			return JSON.stringify(englishLocalization)
		} else if (req.url === '/localizations/es-US.json') {
			return JSON.stringify(spanishLocalization)
		} else {
			logger('Outbound request', req.url)
			return crossFetch(req) as any
		}
	})
}

export function teardownNetworkIntercepts() {
	fetchMock.resetMocks()
}

export function setupReactRoot() {
	const container = document.createElement('div')
	container.id = 'root'
	document.body.appendChild(container)
	return container
}

export function teardownReactRoot(container: element) {
	unmountComponentAtNode(container)
	container.remove()
	container = null
	return null
}
