/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Head } from 'next/head'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js'
import { ApolloProvider } from '@apollo/client'
import { initializeIcons } from '@fluentui/react'
import React, { FC, useEffect, memo } from 'react'
import { createApolloClient } from '~api'
import { RecoilRoot } from 'recoil'
import { ToastProvider } from 'react-toast-notifications'
import { IntlProvider } from 'react-intl'
import { useLocale } from '~hooks/useLocale'
import { default as NextApp } from 'next/app'
import { reactPlugin } from '~utils/appinsights'
/* eslint-disable no-restricted-globals */

import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'
import ClientOnly from '~components/ui/ClientOnly'
import getStatic from '~utils/getStatic'

const Stateful: FC = memo(function Stateful({ children }) {
	const apiClient = createApolloClient()
	return (
		<ApolloProvider client={apiClient}>
			<RecoilRoot>{children}</RecoilRoot>
		</ApolloProvider>
	)
})

const Localized: FC<{ locale: string }> = memo(function Localized({ children, locale }) {
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

export default class App extends NextApp {
	public componentDidCatch(error: Error) {
		reactPlugin.trackException({ exception: error })
	}

	public render() {
		this.trackPageView()
		const { router, pageProps, Component } = this.props
		return (
			<AppInsightsContext.Provider value={reactPlugin}>
				<Head>
					<link
						href={getStatic('/images/favicon.ico')}
						rel='shortcut icon'
						type='image/x-icon'
					></link>
					<link href={getStatic('/images/favicon.png')} rel='apple-touch-icon'></link>
					<link rel='manifest' href={getStatic('/manifest.webmanifest')} />
				</Head>
				<Stateful>
					<Localized locale={router.locale}>
						<Frameworked>
							<Component {...pageProps} />
						</Frameworked>
					</Localized>
				</Stateful>
			</AppInsightsContext.Provider>
		)
	}

	private trackPageView() {
		if (typeof location !== 'undefined') {
			const name =
				this.props.Component.displayName || this.props.Component.name || location.pathname
			const properties = {
				route: this.props.router.route
			}
			if (this.props.router.query) {
				for (const key in this.props.router.query) {
					properties[`query.${key}`] = this.props.router.query[key]
				}
			}
			reactPlugin.trackPageView({ name, properties })
		}
	}
}
