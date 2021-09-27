/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import Head from 'react-helmet'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { ApolloProvider } from '@apollo/client'
import { initializeIcons } from '@fluentui/react'
import { Component, FC, useEffect, memo } from 'react'
import { createApolloClient } from '~api'
import { RecoilRoot } from 'recoil'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import { useLocale } from '~hooks/useLocale'
import { reactPlugin } from '~utils/appinsights'
/* eslint-disable no-restricted-globals */

import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'
import ClientOnly from '~components/ui/ClientOnly'
import { Routes } from './Routes'

const Stateful: FC = memo(function Stateful({ children }) {
	const apiClient = createApolloClient()
	return (
		<ApolloProvider client={apiClient}>
			<RecoilRoot>{children}</RecoilRoot>
		</ApolloProvider>
	)
})

const Localized: FC = memo(function Localized({ children }) {
	const [localeValue] = useLocale()
	return <IntlProvider locale={localeValue}>{children}</IntlProvider>
})

const Frameworked: FC = memo(function Frameworked({ children }) {
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

const PWA: FC = memo(function PWA({ children }) {
	useEffect(function registerServiceWorker() {
		if ('serviceWorker' in navigator) {
			try {
				navigator.serviceWorker
					.register('/app.sw.js')
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

export class App extends Component {
	public componentDidCatch(error: Error) {
		reactPlugin.trackException({ exception: error })
	}

	public render() {
		this.trackPageView()
		return (
			<AppInsightsContext.Provider value={reactPlugin}>
				<Stateful>
					<PWA>
						<Localized>
							<Frameworked>
								<Routes />
							</Frameworked>
						</Localized>
					</PWA>
				</Stateful>
			</AppInsightsContext.Provider>
		)
	}

	private trackPageView() {
		if (typeof location !== 'undefined') {
			const name = location.pathname
			// TODO: wire in route, query args into properties hash
			const properties = {
				route: name
			}
			// const properties = {
			// 	route: this.props.router.route
			// }
			// if (this.props.router.query) {
			// 	for (const key in this.props.router.query) {
			// 		properties[`query.${key}`] = this.props.router.query[key]
			// 	}
			// }
			reactPlugin.trackPageView({ name, properties })
		}
	}
}
