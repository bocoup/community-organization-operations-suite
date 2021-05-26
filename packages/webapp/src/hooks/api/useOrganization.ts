/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Organization } from '@greenlight/schema/lib/client-types'

const GET_ORGANIZATION = gql`
	query organization($orgId: String!) {
		organization(orgId: $orgId) {
			name
			description
		}
	}
`

export function useOrganization(orgId: string): ApiResponse<Organization> {
	const { loading, error, data } = useQuery(GET_ORGANIZATION, {
		variables: { orgId }
	})

	if (error) {
		console.error('error loading data', error)
	}

	const orgData: Organization = !loading && (data?.organization as Organization)

	return {
		loading,
		error,
		data: orgData
	}
}
