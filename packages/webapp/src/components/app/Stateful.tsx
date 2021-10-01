/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import { History } from 'history'
import { FC, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { createApolloClient } from '~api'

export const Stateful: FC = memo(function Stateful({ children }) {
	const history: History = useHistory() as any
	const apiClient = createApolloClient(history)
	return (
		<ApolloProvider client={apiClient}>
			<RecoilRoot>{children}</RecoilRoot>
		</ApolloProvider>
	)
})
