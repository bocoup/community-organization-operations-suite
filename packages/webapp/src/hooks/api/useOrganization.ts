/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import type { ApiResponse } from './types'
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

	query organization($orgId: String!) {
		organization(orgId: $orgId) {
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

	// Recoil state used to store and return the cached organization
	const [organization, setOrg] = useRecoilState<Organization | null>(organizationState)

	/**
	 * Lazy graphql query.
	 * @params
	 * @returns an array with the first element being the load function and the second element being the graphql returns
	 *
	 *
	 * */
	const [load, { loading, error }] = useLazyQuery(GET_ORGANIZATION, {
		fetchPolicy: 'cache-first',
		onCompleted: (data) => {
			if (data?.organization) {
				// Use a setTimeout here to avoid an error: "Cannot update a component (`Notifications2`) while rendering a
				// different component (`ContainerLayout2`). To locate the bad setState() call inside `ContainerLayout2`"
				// when toggling online/offline. This error appeared after switching the fetch policy from cache-and-network
				// to cache-first so now the load function returns immediately if data is present in the cache. This hook
				// likely needs a refactor. Perhaps a useQuery is more appropriate.
				setTimeout(() => {
					setOrg(data.organization)
				})
			}
		},
		onError: (error) => {
			logger(c('hooks.useOrganization.loadData.failed'), error)
		}
	})

	// If an orgId was passed execute the load function immediately
	// Otherwise, just return the organization and do NOT make a graph query
	useEffect(() => {
		if (orgId) {
			load({ variables: { orgId } })
		}
	}, [orgId, load])

	const loadOrganization = useCallback(
		(id: string) => {
			load({ variables: { orgId: id } })
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
