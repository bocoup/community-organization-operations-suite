/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import { initializeIcons } from '@fluentui/react'
import type { AppProps } from 'next/app'
import { useEffect, memo } from 'react'
import { createApolloClient } from '~api'
import { RecoilRoot } from 'recoil'
import { appWithTranslation } from 'next-i18next'
import { ToastProvider } from 'react-toast-notifications'
import Head from 'next/head'
import getStatic from '~utils/getStatic'

import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'

const App = memo(function App({ Component, router, pageProps }: AppProps): JSX.Element {
	useEffect(() => {
		if (router.locale && typeof localStorage !== 'undefined') {
			localStorage.setItem('locale', router.locale)
		}
	}, [router])

	useEffect(() => {
		initializeIcons()

		// Register the service worker
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', async () => {
				try {
					const swRegistration = await navigator.serviceWorker.register(
						getStatic('service-worker/index.js')
					)

					if (swRegistration) {
						// Get the service worker
						const client = swRegistration?.active ?? swRegistration?.installing

						// Post env data to the service worker
						if (client) {
							client.postMessage({ message: 'Browser message', env: process.env.NODE_ENV })
						}
					}
				} catch (err) {
					console.log('Service Worker registration failed: ', err)
				}
			})
		} else {
			console.log('Service workers are not supported by this browser')
		}

		// Request permission to send notifications
		Notification.requestPermission(function (status) {
			console.log('Notification permission status:', status)
		})
	}, [])

	const apiClient = createApolloClient()

	return (
		<>
			<Head>
				<link rel='manifest' href={getStatic('manifest.json')} />
			</Head>

			{/* Wrap the page in providers */}
			<ApolloProvider client={apiClient}>
				<RecoilRoot>
					<ToastProvider autoDismiss placement='top-center' autoDismissTimeout={2500}>
						{/* The Page Component */}
						<Component {...pageProps} />{' '}
					</ToastProvider>
				</RecoilRoot>
			</ApolloProvider>
		</>
	)
})

export default appWithTranslation(App)
