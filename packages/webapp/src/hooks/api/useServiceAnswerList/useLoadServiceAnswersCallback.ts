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

//TODO: might need to change this to eliminate offset/limit - this caused issues with Engagements
const GET_SERVICE_ANSWERS = gql`
	${ServiceAnswerFields}
	query GetServiceAnswers($serviceId: String!, $offset: Int, $limit: Int) {
		serviceAnswers(serviceId: $serviceId, offset: $offset, limit: $limit) {
			...ServiceAnswerFields
		}
	}
`

export function useLoadServiceAnswersCallback(serviceId?: string) {
	const { data, /*loading,*/ error, fetchMore, refetch } = useQuery(GET_SERVICE_ANSWERS, {
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

	return { data: result, loading: false, refetch, fetchMore }
}
