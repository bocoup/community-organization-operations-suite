/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Engagement } from '@cbosuite/schema/dist/client-types'
import { useEffect } from 'react'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { useEngagementList } from '~hooks/api/useEngagementList'
import { useInactiveEngagementList } from '~hooks/api/useInactiveEngagementList'

export function useRequestReportData(
	setUnfilteredData: (data: unknown[]) => void,
	setFilteredData: (data: unknown[]) => void
) {
	const { userId, orgId } = useCurrentUser()
	const { myEngagementList, engagementList } = useEngagementList(orgId, userId)
	const { inactiveEngagementList } = useInactiveEngagementList(orgId)

	useEffect(
		function initializeData() {
			const data = [
				...myEngagementList,
				...engagementList,
				...inactiveEngagementList
			] as Engagement[]

			setUnfilteredData(data)
			setFilteredData(data)
		},
		[setUnfilteredData, setFilteredData, myEngagementList, engagementList, inactiveEngagementList]
	)
}
