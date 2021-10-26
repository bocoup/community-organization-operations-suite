/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { render } from 'react-dom'
import { App } from './components/app'
import { createLogger } from '~utils/createLogger'
import { config } from '~utils/config'
const logger = createLogger('app')

export function mount() {
	try {
		logger('mounting react application')
		;(window as any).__APP_VERSION__ = config.site.version
		const root = document.getElementById('root')
		render(<App />, root)
	} catch (e) {
		logger('error mounting application', e)
		throw e
	}
}
