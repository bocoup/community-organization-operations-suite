/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useToasts as _useToasts } from 'react-toast-notifications'
import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import { config } from '~utils/config'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useToasts')

export interface ToastHandle {
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
export function useToasts(): ToastHandle {
	const { addToast: toast } = _useToasts()

	const success = useCallback(
		(msg: string) => {
			toast(msg, { appearance: ToastAppearance.Success })
		},
		[toast]
	)

	const failure = useCallback(
		(msg: string, error?: string) => {
			logger(`error: ${msg}`, '\n \n', error)

			if (config.features.debugToastFailure.enabled) debugger

			toast(msg, { appearance: ToastAppearance.Error, autoDismissTimeout: 4000 })
		},
		[toast]
	)

	const warning = useCallback(
		(msg: string) => {
			toast(msg, { appearance: ToastAppearance.Warning })
		},
		[toast]
	)

	const info = useCallback(
		(msg: string) => {
			toast(msg, { appearance: ToastAppearance.Info })
		},
		[toast]
	)

	return useMemo(
		() => ({
			success,
			failure,
			warning,
			info
		}),
		[success, failure, warning, info]
	)
}
