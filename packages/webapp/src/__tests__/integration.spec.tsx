/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { App } from '~components/app'
import { render, RenderResult, waitFor } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'
import fetch from 'cross-fetch'
import config from 'config'
import englishLocalization from '../../dist/localizations/en-US.json'
import spanishLocalization from '../../dist/localizations/es-US.json'
import { act } from 'react-dom/test-utils'

describe('The CBOSuite App', () => {
	beforeEach(() => {
		fetchMock.mockResponse(async (req) => {
			if (req.url === '/localizations/en-US.json') {
				return JSON.stringify(englishLocalization)
			} else if (req.url === '/localizations/es-US.json') {
				return JSON.stringify(spanishLocalization)
			} else {
				return fetch(req).then((res) => res.json())
			}
		})
	})
	it('can render the application', async () => {
		let rendered: RenderResult<any>
		act(() => {
			rendered = render(<App />)
		})
		await waitFor(() => {
			expect(rendered).toBeDefined()
		})
	})
})
