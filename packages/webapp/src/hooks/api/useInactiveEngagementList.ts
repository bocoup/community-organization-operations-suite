/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery } from '@apollo/client'
import type { ApiResponse } from './types'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { GET_INACTIVE_ENGAGEMENTS } from '~queries'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useInativeEngagementList')

interface useInactiveEngagementListReturn extends ApiResponse<Engagement[]> {
	inactiveEngagementList: Engagement[]
}

export function useInactiveEngagementList(orgId?: string): useInactiveEngagementListReturn {
	const { c } = useTranslation(Namespace.Common)

	// Engagements query
	const { loading, data, error } = useQuery(GET_INACTIVE_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { orgId: orgId },
		onError: (error) => logger(c('hooks.useInactiveEngagementList.loadDataFailed'), error)
	})

	return {
		error,
		loading,
		inactiveEngagementList: data?.inactiveEngagements ?? []
	}
}
