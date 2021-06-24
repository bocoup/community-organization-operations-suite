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

import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'

const App = memo(function App({ Component, pageProps }: AppProps): JSX.Element {
	useEffect(() => {
		initializeIcons()
	}, [])
	const apiClient = createApolloClient()

	return (
		<>
			{/* Wrap the page in providers */}
			<ApolloProvider client={apiClient}>
				<RecoilRoot>
					{/* The Page Component */}
					<Component {...pageProps} />{' '}
				</RecoilRoot>
			</ApolloProvider>
		</>
	)
})
export default App
