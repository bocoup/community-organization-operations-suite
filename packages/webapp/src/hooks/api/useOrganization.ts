/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import { ApiResponse } from './types'
import type { Organization } from '@cbosuite/schema/dist/client-types'
import { OrgFields } from '~hooks/api/fragments'
import { organizationState } from '~store'
import { useRecoilState } from 'recoil'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useOrganization')

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
	loadOrganization: (id: string) => void
}

export function useOrganization(orgId?: string): UseOranizationReturn {
	// Common translations
	const { c } = useTranslation()

	/**
	 * Lazy graphql query.
	 * @params
	 * @returns an array with the first element being the load function and the second element being the graphql returns
	 *
	 *
	 * */
	const [load, { loading, error }] = useLazyQuery(GET_ORGANIZATION, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			if (data?.organization) {
				setOrg(data.organization)
			}
		},
		onError: (error) => {
			logger(c('hooks.useOrganization.loadData.failed'), error)
		}
	})

	// Recoil state used to store and return the cached organization
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	// If an orgId was passed execute the load function immediately
	// Otherwise, just return the organization and do NOT make a graph query
	useEffect(() => {
		if (orgId) {
			load({ variables: { body: { orgId } } })
		}
	}, [orgId, load])

	const loadOrganization = useCallback(
		(id: string) => {
			load({ variables: { body: { orgId: id } } })
		},
		[load]
	)

	return useMemo(
		() => ({
			loading,
			error,
			loadOrganization,
			organization
		}),
		[loading, error, loadOrganization, organization]
	)
}
