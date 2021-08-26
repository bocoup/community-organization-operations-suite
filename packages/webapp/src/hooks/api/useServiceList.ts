/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { Service, ServiceInput } from '@cbosuite/schema/lib/client-types'
import { serviceListState } from '~store'
import { ApiResponse } from './types'
import { useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { ServiceFields } from './fragments'
import useToasts from '~hooks/useToasts'

export const GET_SERVICES = gql`
	${ServiceFields}
	query services($body: OrganizationIdInput!) {
		services(body: $body) {
			...ServiceFields
		}
	}
`

const CREATE_SERVICE = gql`
	${ServiceFields}

	mutation createService($body: ServiceInput!) {
		createService(body: $body) {
			message
			status
			service {
				...ServiceFields
			}
		}
	}
`

interface useServiceListReturn extends ApiResponse<Service[]> {
	serviceList: Service[]
	addNewService: (service: ServiceInput) => Promise<boolean>
}

export function useServiceList(orgId?: string): useServiceListReturn {
	const { success, failure } = useToasts()
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

	const [addService] = useMutation(CREATE_SERVICE)

	const addNewService = async (service: ServiceInput) => {
		try {
			await addService({ variables: { body: service } })
			load({ variables: { body: { orgId } } })
			success('Service added')
			return true
		} catch (error) {
			failure('Create service failed')
			return false
		}
	}

	return {
		loading,
		error,
		refetch,
		fetchMore,
		serviceList,
		addNewService
	}
}
