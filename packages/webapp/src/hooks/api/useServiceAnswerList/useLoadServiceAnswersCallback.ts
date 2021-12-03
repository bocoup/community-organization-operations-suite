/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import { ServiceAnswerFields } from '../fragments'
import { createLogger } from '~utils/createLogger'
import { empty } from '~utils/noop'
const log = createLogger('use load service answers')

const GET_SERVICE_ANSWERS = gql`
	${ServiceAnswerFields}
	query GetServiceAnswers($serviceId: String!, $offset: Int, $limit: Int) {
		serviceAnswers(serviceId: $serviceId, offset: $offset, limit: $limit) {
			...ServiceAnswerFields
		}
	}
`

export function useLoadServiceAnswersCallback(serviceId?: string) {
	const { data, loading, error, fetchMore, refetch } = useQuery(GET_SERVICE_ANSWERS, {
		variables: { serviceId },
		skip: serviceId == null
	})

	useEffect(() => {
		if (error) {
			log('error fetching data', error)
		}
	}, [error])

	return { data: data?.serviceAnswers || empty, loading, refetch, fetchMore }
}
