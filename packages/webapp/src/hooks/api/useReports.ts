/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// TODO: replace useOrganization with this one entirely

import { gql, useQuery } from '@apollo/client'
import { ApiResponse } from './types'
import type { Engagement } from '@cbosuite/schema/dist/client-types'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from './useCurrentUser'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useReports')

// TODO: Create fragment and use that instead of full field description
export const EXPORT_ENGAGEMENT_DATA = gql`
	query exportData($orgId: String!) {
		exportData(body: $orgId) {
			id
			description
			status
			startDate
			endDate
			orgId
			tags {
				id
				label
			}
			user {
				name {
					first
					middle
					last
				}
			}
			contact {
				name {
					first
					middle
					last
				}
			}
			description
			actions {
				date
				comment
				tags {
					id
					label
				}
				user {
					name {
						first
						middle
						last
					}
				}
				taggedUser {
					name {
						first
						middle
						last
					}
				}
			}
		}
	}
`

// TODO: change to use Engagement
export function useReports(): ApiResponse<Engagement[]> {
	const { c } = useTranslation()
	const { orgId } = useCurrentUser()

	const { loading, error, data, refetch } = useQuery(EXPORT_ENGAGEMENT_DATA, {
		variables: { orgId },
		fetchPolicy: 'cache-and-network'
	})

	if (error) {
		logger(c('hooks.useReports.loadDataFailed'), error)
	}

	const engagements: Engagement[] = !loading && (data?.exportData as Engagement[])

	return {
		loading,
		error,
		refetch,
		data: engagements
	}
}
