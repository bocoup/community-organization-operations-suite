/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'react-helmet'
import { FC, useEffect, memo } from 'react'
import config from '~utils/config'
import { getStatic } from '~utils/getStatic'
import { createLogger } from '~utils/createLogger'

const logger = createLogger('pwa')

export const Progressive: FC = memo(function Progressive({ children }) {
	useEffect(function registerServiceWorker() {
		if ('serviceWorker' in navigator && config.features.serviceWorker.enabled) {
			try {
				logger('installing service worker')
				navigator.serviceWorker
					.register(getStatic('/app.sw.js'))
					.then(() => logger('service worker installed'))
			} catch (e) {
				logger('could not install service worker', e)
			}
		} else {
			logger('service worker disabled')
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
