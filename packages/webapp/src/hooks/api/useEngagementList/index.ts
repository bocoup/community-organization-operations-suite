/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ApiResponse } from '../types'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import type { ClaimEngagementCallback } from './useClaimEngagementCallback'
import { useClaimEngagementCallback } from './useClaimEngagementCallback'
import type { EditEngagementCallback } from './useEditEngagementCallback'
import { useEditEngagementCallback } from './useEditEngagementCallback'
import type { AddEngagementCallback } from './addEngagementCallback'
import { useAddEngagementCallback } from './addEngagementCallback'
import { useEngagementSubscription } from './useEngagementSubscription'
import { useEngagementData } from './useEngagementListData'
import { useMemo } from 'react'
export { GET_ENGAGEMENTS } from './useEngagementListData'

interface useEngagementListReturn extends ApiResponse<Engagement[]> {
	addEngagement: AddEngagementCallback
	editEngagement: EditEngagementCallback
	claimEngagement: ClaimEngagementCallback
	engagementList: Engagement[]
	myEngagementList: Engagement[]
}

// FIXME: update to only have ONE input as an object
export function useEngagementList(orgId?: string, userId?: string): useEngagementListReturn {
	const { loading, error, refetch, fetchMore, engagementList, myEngagementList } =
		useEngagementData(orgId, userId)

	// Subscribe to engagement updates
	useEngagementSubscription(orgId)
	const addEngagement = useAddEngagementCallback()
	const editEngagement = useEditEngagementCallback()
	const claimEngagement = useClaimEngagementCallback()

	return useMemo(
		() => ({
			loading,
			error,
			refetch,
			fetchMore,
			addEngagement,
			editEngagement,
			claimEngagement,
			engagementList,
			myEngagementList
		}),
		[
			loading,
			error,
			refetch,
			fetchMore,
			addEngagement,
			editEngagement,
			claimEngagement,
			engagementList,
			myEngagementList
		]
	)
}
