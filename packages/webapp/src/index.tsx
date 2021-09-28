/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { render } from 'react-dom'
import { App } from './components/app'
import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('app')

function mount() {
	try {
		logger('mounting react application')
		const root = document.getElementById('root')
		render(<App />, root)
	} catch (e) {
		logger(e)
		throw e
	}
}

mount()