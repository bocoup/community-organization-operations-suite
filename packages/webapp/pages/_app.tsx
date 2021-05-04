/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { initializeIcons } from '@fluentui/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '~store'
import '~styles/App_reset_styles.scss'
import '~styles/bootstrap.custom.scss'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
	// initializeIcons()
	useEffect(() => {
		initializeIcons()
	}, [])

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Component className='test' {...pageProps} />{' '}
			</PersistGate>
		</Provider>
	)
}
