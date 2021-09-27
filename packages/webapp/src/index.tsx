/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { StrictMode } from 'react'
import { render } from 'react-dom'
import { App } from './components/app'
import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('app')

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
		logger(e)
		throw e
	}
}

mount()
