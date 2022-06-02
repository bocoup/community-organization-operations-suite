/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ApolloQueryResult } from '@apollo/client'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { createLogger } from '~utils/createLogger'
import { GET_USER_ACTIVES_ENGAGEMENTS } from '~queries'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

const logger = createLogger('useEngagementList')

export interface EngagementDataResult {
	loading: boolean
	error: Error
	refetch?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
	fetchMore?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
	data: {
		engagementList: Engagement[]
		myEngagementList: Engagement[]
	}
}

// FIXME: update to only have ONE input as an object
export function useEngagementData(orgId?: string, userId?: string): EngagementDataResult {
	const { c } = useTranslation(Namespace.Common)

	// Engagements query
	const [load, { loading, error, refetch, fetchMore, data }] = useLazyQuery(
		GET_USER_ACTIVES_ENGAGEMENTS,
		{
			fetchPolicy: 'cache-and-network',
			onError: (error) => logger(c('hooks.useEngagementList.loadDataFailed'), error)
		}
	)

	useEffect(() => {
		if (orgId && userId) {
			load({ variables: { orgId, userId } })
		}
	}, [orgId, userId, load])

	return {
		data,
		error,
		fetchMore,
		loading,
		refetch
	}
}
