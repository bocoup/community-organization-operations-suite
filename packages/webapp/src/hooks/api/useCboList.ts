/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Organization } from '@community-organization-operations-suite/schema/lib/client-types'

const GET_CBO_LIST = gql`
	query {
		organizations {
			name
		}
	}
`

export function useCboList(): ApiResponse<Organization[]> {
	const { loading, error, data } = useQuery(GET_CBO_LIST)
	if (error) {
		console.error('error loading data', error)
	}

	const cboData: Organization[] = !loading && (data?.organizations as Organization[])

	return {
		loading,
		error,
		data: cboData
	}
}
