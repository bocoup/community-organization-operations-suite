/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import { ApiResponse } from './types'
import type { Organization } from '@greenlight/schema/lib/client-types'
import { OrgFields } from '~hooks/api/fragments'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'

export const GET_ORGANIZATION = gql`
	${OrgFields}

	query organization($body: OrganizationIdInput!) {
		organization(body: $body) {
			...OrgFields
		}
	}
`

export function useOrganization(orgId?: string): ApiResponse<Organization> {
	const [load, { loading, error, data }] = useLazyQuery(GET_ORGANIZATION, {
		fetchPolicy: 'cache-and-network',
		onCompleted: data => {
			if (data?.organization) {
				setOrg(data.organization)
			}
		}
	})
	const [, setOrg] = useRecoilState<Organization | null>(organizationState)

	const orgData: Organization = !loading && (data?.organization as Organization)

	useEffect(() => {
		if (error) {
			console.error('error loading data', error)
		}
	}, [error])

	useEffect(() => {
		if (orgId) {
			load({ variables: { body: { orgId } } })
		}
	}, [orgId, load])

	return {
		loading,
		error,
		data: orgData
	}
}
