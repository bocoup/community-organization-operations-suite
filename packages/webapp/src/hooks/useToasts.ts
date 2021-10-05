/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useToasts as _useToasts } from 'react-toast-notifications'
import { ReactNode } from 'react'
import { config } from '~utils/config'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useToasts')

type useToastReturns = {
	success: (message: ReactNode) => void
	failure: (message: ReactNode, error?: string) => void
	warning: (message: ReactNode) => void
	info: (message: ReactNode) => void
}

enum ToastAppearance {
	Success = 'success',
	Failure = 'failure',
	Error = 'error',
	Warning = 'warning',
	Info = 'info'
}

/**
 * Wrapper for around {useToasts} react-toast-notifications
 */
export function useToasts(): useToastReturns {
	const { addToast } = _useToasts()

	const success: useToastReturns['success'] = (message) => {
		addToast(message, { appearance: ToastAppearance.Success })
	}

	const failure: useToastReturns['failure'] = (message, error) => {
		logger(`error: ${message}`, '\n \n', error)

		if (config.features.debugToastFailure.enabled) debugger

		addToast(message, { appearance: ToastAppearance.Error, autoDismissTimeout: 4000 })
	}

	const warning: useToastReturns['warning'] = (message) => {
		addToast(message, { appearance: ToastAppearance.Warning })
	}

	const info: useToastReturns['info'] = (message) => {
		addToast(message, { appearance: ToastAppearance.Info })
	}

	return {
		success,
		failure,
		warning,
		info
	}
}
