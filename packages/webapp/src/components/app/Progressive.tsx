/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'react-helmet'
import { FC, useEffect, memo } from 'react'
import config from '~utils/config'
import { getStatic } from '~utils/getStatic'

export const Progressive: FC = memo(function PWA({ children }) {
	useEffect(function registerServiceWorker() {
		if ('serviceWorker' in navigator && config.features.serviceWorker.enabled) {
			try {
				navigator.serviceWorker
					.register(getStatic('/app.sw.js'))
					.then(() => console.log('service worker registered'))
			} catch (e) {
				console.error('could not register app service worker', e)
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
