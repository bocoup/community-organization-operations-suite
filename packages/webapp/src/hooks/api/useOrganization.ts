/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import { ApiResponse } from './types'
import type { Organization, OrganizationIdInput } from '@greenlight/schema/lib/client-types'
import { OrgFields } from '~hooks/api/fragments'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { useTranslation } from '~hooks/useTranslation'

export const GET_ORGANIZATION = gql`
	${OrgFields}

	query organization($body: OrganizationIdInput!) {
		organization(body: $body) {
			...OrgFields
		}
	}
`

export interface UseOranizationReturn extends ApiResponse<Organization> {
	organization?: Organization
}

export function useOrganization(orgId?: string): UseOranizationReturn {
	const { c } = useTranslation()
	const [load, { loading, error, data }] = useLazyQuery(GET_ORGANIZATION, {
		fetchPolicy: 'cache-and-network',
		onCompleted: data => {
			if (data?.organization) {
				setOrg(data.organization)
			}
		}
	})
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	useEffect(() => {
		if (error) {
			console.error(c('hooks.useOrganization.loadData.failed'), error)
		}
	}, [error, c])

	useEffect(() => {
		if (orgId) {
			load({ variables: { body: { orgId } } })
		}
	}, [orgId, load])

	return {
		loading,
		error,
		organization
	}
}
