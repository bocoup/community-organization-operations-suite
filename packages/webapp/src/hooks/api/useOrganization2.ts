/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
// TODO: replace useOrganization with this one entirely

import { gql, useLazyQuery } from '@apollo/client'
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

interface UseOrganizationReturn extends ApiResponse<Organization> {
	organization?: Organization
}

export function useOrganization(orgId?: string): UseOrganizationReturn {
	const [loadOrganization, { loading, error, data }] = useLazyQuery(GET_ORGANIZATION, {
		fetchPolicy: 'cache-and-network'
	})
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	// Load data if id is passed
	useEffect(() => {
		if (orgId) {
			loadOrganization({
				variables: { body: { orgId } }
			})
		}
	}, [orgId, loadOrganization])

	// Set atom when data is loaded
	useEffect(() => {
		if (!loading && data?.organization) {
			setOrg(data.organization as Organization)
		}
	}, [data, setOrg, loading])

	// Monitor errors
	useEffect(() => {
		if (error) console.error('Error loading organization', error)
	}, [error])

	return {
		loading,
		error,
		organization
	}
}
