/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'next/head'
import { FC, useEffect, memo } from 'react'
import config from '~utils/config'
import { createLogger } from '~utils/createLogger'

const logger = createLogger('pwa')

export const Progressive: FC = memo(function Progressive({ children }) {
	useEffect(function registerServiceWorker() {
		if ('serviceWorker' in navigator && config.features.serviceWorker.enabled) {
			try {
				navigator.serviceWorker
					.register('/app.sw.js')
					.then(() => logger('service worker registered'))
			} catch (e) {
				logger('could not register app service worker', e)
			}
		}
	}, [])
	return (
		<>
			<Head>
				<link href={'/images/favicon.ico'} rel='shortcut icon' type='image/x-icon'></link>
				<link href={'/images/favicon.png'} rel='apple-touch-icon'></link>
				<link rel='manifest' href={'/manifest.webmanifest'} />
			</Head>
			{children}
		</>
	)
})
