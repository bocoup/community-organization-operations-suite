/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import { Service } from '@cbosuite/schema/lib/client-types'
import { serviceListState } from '~store'
import { ApiResponse } from './types'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { ServiceFields } from './fragments'

export const GET_SERVICES = gql`
	${ServiceFields}
	query services($body: OrganizationIdInput!) {
		services(body: $body) {
			...ServiceFields
		}
	}
`

interface useServiceListReturn extends ApiResponse<Service[]> {
	serviceList: Service[]
}

export function useServiceList(orgId?: string): useServiceListReturn {
	const [serviceList, setServiceList] = useRecoilState<Service[] | null>(serviceListState)

	const [load, { loading, error, refetch, fetchMore }] = useLazyQuery(GET_SERVICES, {
		fetchPolicy: 'cache-and-network',
		onCompleted: data => {
			if (data?.services) {
				setServiceList(data.services)
			}
		},
		onError: error => {
			if (error) {
				console.error('load service list failed', error)
			}
		}
	})

	useEffect(() => {
		if (orgId) {
			load({ variables: { body: { orgId } } })
		}
	}, [orgId, load])

	if (error) {
		console.error('load service list failed', error)
	}

	return {
		loading,
		error,
		refetch,
		fetchMore,
		serviceList
	}
}
