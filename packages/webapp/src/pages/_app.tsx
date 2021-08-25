/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import { initializeIcons } from '@fluentui/react'
import type { AppProps } from 'next/app'
import { FC, useEffect, memo } from 'react'
import { createApolloClient } from '~api'
import { RecoilRoot } from 'recoil'
import { ToastProvider } from 'react-toast-notifications'
import Head from 'next/head'
import getStatic from '~utils/getStatic'
import { IntlProvider } from 'react-intl'
import { useLocale } from '~hooks/useLocale'

import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'

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
		<>
			<Head>
				<link rel='manifest' href={getStatic('manifest.json')} />
			</Head>
			<ToastProvider autoDismiss placement='top-center' autoDismissTimeout={2500}>
				{children}
			</ToastProvider>
		</>
	)
})

const App: FC<AppProps> = memo(function App({ Component, router, pageProps }) {
	return (
		<Stateful>
			<Localized locale={router.locale}>
				<Frameworked>
					{/* The Page Component */}
					<Component {...pageProps} />
				</Frameworked>
			</Localized>
		</Stateful>
	)
})

export default App
