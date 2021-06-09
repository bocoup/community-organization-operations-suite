/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type { Organization } from '@greenlight/schema/lib/client-types'
import { OrgFields } from '~hooks/api/fragments'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'

export const GET_ORGANIZATION = gql`
	${OrgFields}

	query organization($orgId: String!) {
		organization(orgId: $orgId) {
			...OrgFields
		}
	}
`

export function useOrganization(orgId: string): ApiResponse<Organization> {
	const { loading, error, data } = useQuery(GET_ORGANIZATION, {
		variables: { orgId },
		fetchPolicy: 'network-only'
	})
	const [, setOrg] = useRecoilState<Organization | null>(organizationState)

	if (error) {
		console.error('error loading data', error)
	}

	const orgData: Organization = !loading && (data?.organization as Organization)

	useEffect(() => {
		if (data?.organization) {
			setOrg(data.organization)
		}
	}, [data, setOrg])

	return {
		loading,
		error,
		data: orgData
	}
}
