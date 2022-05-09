/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import type { History } from 'history'
import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { createApolloClient } from '~api'
import QueueLink from 'apollo-link-queue'
import { useOffline } from '~hooks/useOffline'

// Create an Apollo Link to queue request while offline
const queueLink = new QueueLink()

export const Stateful: FC = memo(function Stateful({ children }) {
	const history: History = useHistory() as any
	const apiClient = createApolloClient(history, queueLink)
	const isOffline = useOffline()

	useEffect(() => {
		if (isOffline) {
			queueLink.close()
		} else {
			queueLink.open()
		}
	}, [isOffline])

	return (
		<ApolloProvider client={apiClient}>
			<RecoilRoot>{children}</RecoilRoot>
		</ApolloProvider>
	)
})
