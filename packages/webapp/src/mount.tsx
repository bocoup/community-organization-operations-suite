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
		prepareHelpWidget()
		attachApplicationVersion()
		logger('mounting react application')
		mountReactApplication()
	} catch (e) {
		logger('error mounting application', e)
		throw e
	}
}

function mountReactApplication() {
	const root = document.getElementById('root')
	render(<App />, root)
}

/**
 * Attaches the current git hash to the window; useful for ops
 */
function attachApplicationVersion() {
	const w = window as any
	w.__APP_VERSION__ = config.site.version
}

/**
 * Prepares the interactive help widget
 */
function prepareHelpWidget() {
	if (config.features.beacon.enabled && config.features.beacon.key != null) {
		const w = window as any
		if (w.Beacon) {
			w.Beacon('init', config.features.beacon.key)
		} else {
			logger('window.Beacon not found, help is disabled')
		}
	}
}
