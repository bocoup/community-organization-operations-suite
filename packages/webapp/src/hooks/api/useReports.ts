/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// TODO: replace useOrganization with this one entirely

import { gql, useQuery } from '@apollo/client'
import { ApiResponse } from './types'
import { useRecoilValue } from 'recoil'
import { userAuthState } from '~store'
import type { AuthenticationResponse, Engagement } from '@resolve/schema/lib/client-types'
import { useTranslation } from '~hooks/useTranslation'

// TODO: Create fragment and use that instead of full field description
export const EXPORT_ENGAGEMENT_DATA = gql`
	query exportData($body: OrganizationIdInput!) {
		exportData(body: $body) {
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
	const authUser = useRecoilValue<AuthenticationResponse>(userAuthState)
	const orgId = authUser?.user?.roles[0]?.orgId

	const { loading, error, data, refetch } = useQuery(EXPORT_ENGAGEMENT_DATA, {
		variables: { body: { orgId } },
		fetchPolicy: 'cache-and-network'
	})

	if (error) {
		console.error(c('hooks.useReports.loadData.failed'), error)
	}

	const engagements: Engagement[] = !loading && (data?.exportData as Engagement[])

	return {
		loading,
		error,
		refetch,
		data: engagements
	}
}
