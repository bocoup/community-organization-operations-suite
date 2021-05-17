/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import { initializeIcons } from '@fluentui/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { client } from '~api'
import { persistor, store } from '~store'
import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
	useEffect(() => {
		initializeIcons()
	}, [])

	return (
		<>
			{/* Wrap the page in providers */}
			<ApolloProvider client={client}>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						{/* The Page Component */}
						<Component className='test' {...pageProps} />{' '}
					</PersistGate>
				</Provider>
			</ApolloProvider>
		</>
	)
}
