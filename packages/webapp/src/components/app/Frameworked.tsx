/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-restricted-globals */
import { initializeIcons } from '@fluentui/react'
import React, { FC, useEffect, memo } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import ClientOnly from '~components/ui/ClientOnly'

export const Frameworked: FC = memo(function Frameworked({ children }) {
	useEffect(() => {
		initializeIcons()
	}, [])
	return (
		<ClientOnly>
			<ToastProvider autoDismiss placement='top-center' autoDismissTimeout={2500}>
				{children}
			</ToastProvider>
		</ClientOnly>
	)
})
