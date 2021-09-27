/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './components/App'

function mount() {
	try {
		const root = document.getElementById('root')
		render(
			<StrictMode>
				<App />
			</StrictMode>,
			root
		)
	} catch (e) {
		console.error(e)
	}
}

mount()
