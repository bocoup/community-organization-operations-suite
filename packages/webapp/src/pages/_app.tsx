/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import { initializeIcons } from '@fluentui/react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { createApolloClient } from '~api'
import { RecoilRoot } from 'recoil'

import '~styles/bootstrap.custom.scss'
import '~styles/App_reset_styles.scss'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
	useEffect(() => {
		initializeIcons()
	}, [])

	return (
		<>
			{/* Wrap the page in providers */}
			<ApolloProvider client={createApolloClient()}>
				<RecoilRoot>
					{/* The Page Component */}
					<Component className='test' {...pageProps} />{' '}
				</RecoilRoot>
			</ApolloProvider>
		</>
	)
}
