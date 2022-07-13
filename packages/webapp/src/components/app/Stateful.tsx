/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ApolloProvider } from '@apollo/client'
import type { History } from 'history'
import type { FC } from 'react'
import { useEffect, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { createApolloClient } from '~api'
import QueueLink from '../../utils/queueLink'
import { useOffline } from '~hooks/useOffline'
import { sessionPasswordState } from '~store'

// Create an Apollo Link to queue request while offline
const queueLink = new QueueLink()

export const Stateful: FC = memo(function Stateful({ children }) {
	const history: History = useHistory() as any
	let apiClient = createApolloClient(history, queueLink, false)
	const isOffline = useOffline()
	const [sessionPassword] = useRecoilState(sessionPasswordState)

	useEffect(() => {
		if (isOffline) {
			queueLink.close()
		} else {
			queueLink.open()
		}
	}, [isOffline])

	useEffect(() => {
		if (sessionPassword) {
			// eslint-disable-next-line
			apiClient = createApolloClient(history, queueLink, true)
		}
	}, [sessionPassword])

	return <ApolloProvider client={apiClient}>{children}</ApolloProvider>
})
