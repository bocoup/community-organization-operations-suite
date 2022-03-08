/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initializeIcons } from '@fluentui/react'
import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { ToastProvider } from 'react-toast-notifications'

export const Frameworked: FC = memo(function Frameworked({ children }) {
	useEffect(() => {
		initializeIcons()
	}, [])
	return (
		<ToastProvider autoDismiss placement='top-center' autoDismissTimeout={2500}>
			{children}
		</ToastProvider>
	)
})
