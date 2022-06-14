/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { createLogger } from '~utils/createLogger'
import { GET_USER_ACTIVES_ENGAGEMENTS } from '~queries'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useQuery } from '@apollo/client'

const logger = createLogger('useEngagementList')

export interface EngagementDataResult {
	loading: boolean
	error: Error
	data: {
		engagementList: Engagement[]
		myEngagementList: Engagement[]
	}
}

// FIXME: update to only have ONE input as an object
export function useEngagementData(orgId?: string, userId?: string): EngagementDataResult {
	const { c } = useTranslation(Namespace.Common)

	const { loading, error, data } = useQuery(GET_USER_ACTIVES_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { orgId: orgId, userId: userId },
		onError: (error) => logger(c('hooks.useEngagementList.loadDataFailed'), error)
	})

	return {
		data: {
			engagementList: data?.activeEngagements ?? [],
			myEngagementList: data?.userActiveEngagements ?? []
		},
		error,
		loading
	}
}
