/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useToasts as _useToasts } from 'react-toast-notifications'
import { ReactNode } from 'react'

type useToastReturns = {
	success: (message: ReactNode) => void
	failure: (message: ReactNode, error?: string) => void
	warning: (message: ReactNode) => void
	info: (message: ReactNode) => void
}

/**
 * Wrapper for around {useToasts} react-toast-notifications
 */
const useToasts = (): useToastReturns => {
	const { addToast } = _useToasts()

	const success: useToastReturns['success'] = (message) => {
		addToast(message, { appearance: 'success' })
	}

	const failure: useToastReturns['failure'] = (message, error) => {
		console.error(message, '\n \n', error)

		if (config.features.debugToastFailure.enabled) debugger

		addToast(message, { appearance: 'error', autoDismissTimeout: 4000 })
	}

	const warning: useToastReturns['warning'] = (message) => {
		addToast(message, { appearance: 'warning' })
	}

	const info: useToastReturns['info'] = (message) => {
		addToast(message, { appearance: 'info' })
	}

	return {
		success,
		failure,
		warning,
		info
	}
}

export default useToasts
