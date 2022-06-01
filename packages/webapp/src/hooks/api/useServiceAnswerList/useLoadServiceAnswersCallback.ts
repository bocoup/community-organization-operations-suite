/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery, useApolloClient } from '@apollo/client'
import { useEffect } from 'react'
import { ServiceAnswerFields } from '../fragments'
import { createLogger } from '~utils/createLogger'
import { empty } from '~utils/noop'

const log = createLogger('use load service answers')

export const GET_SERVICE_ANSWERS = gql`
	${ServiceAnswerFields}
	query GetServiceAnswers($serviceId: String!, $offset: Int, $limit: Int) {
		serviceAnswers(serviceId: $serviceId, offset: $offset, limit: $limit) {
			...ServiceAnswerFields
		}
	}
`

export function useLoadServiceAnswersCallback(serviceId?: string) {
	const { data, loading, error, fetchMore, refetch } = useQuery(GET_SERVICE_ANSWERS, {
		variables: { serviceId }
	})

	const client = useApolloClient()

	const cachedData = client.readQuery({
		query: GET_SERVICE_ANSWERS,
		variables: { serviceId }
	})

	useEffect(() => {
		if (error) {
			log('error fetching data', error)
		}
	}, [error])

	// If useQuery returns undefined, try using cache
	const result = data?.serviceAnswers || cachedData?.serviceAnswers || empty
	// If there's nothing in the cache but useQuery is loading, then we want to show a loading spinner
	const waitingOnResult = result === empty ? loading : false

	return { data: result, loading: waitingOnResult, refetch, fetchMore }
}
