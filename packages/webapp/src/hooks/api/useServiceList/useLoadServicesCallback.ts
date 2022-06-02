/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import type { Service } from '@cbosuite/schema/dist/client-types'
import { serviceListState } from '~store'
import { useRecoilState } from 'recoil'
import { useCallback, useEffect, useState } from 'react'
import { ServiceFields } from '../fragments'
import { useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
import { useOffline } from '~hooks/useOffline'

const logger = createLogger('useServiceList')

const GET_SERVICES = gql`
	${ServiceFields}
	query services($orgId: String!) {
		services(orgId: $orgId) {
			...ServiceFields
		}
	}
`

export function useLoadServicesCallback(orgId?: string) {
	const { c } = useTranslation()
	const [, setServiceList] = useRecoilState<Service[]>(serviceListState)
	const [serviceList, setLocalServiceList] = useState<Service[]>()
	const isOffline = useOffline()
	const [executeLoad, { loading, error, refetch, fetchMore }] = useLazyQuery(GET_SERVICES, {
		onCompleted: (data) => {
			if (data?.services) {
				setLocalServiceList(data.services)
			}
		},
		onError: (error) => {
			if (error) {
				logger(c('hooks.useServicelist.loadDataFailed'), error)
			}
		}
	})

	// useEffect reacts to updates on serviceList, this prevents a react "bad setState" error
	useEffect(() => {
		setServiceList(serviceList)
	}, [serviceList])

	const load = useCallback(() => {
		executeLoad({ variables: { orgId }, fetchPolicy: isOffline ? 'cache-only' : 'cache-first' })
	}, [executeLoad, orgId, isOffline])

	useEffect(() => {
		if (orgId) {
			load()
		}
	}, [orgId, load])
	useEffect(() => {
		if (error) {
			logger(c('hooks.useServicelist.loadDataFailed'), error)
		}
	}, [c, error])

	return { load, loading, error, refetch, fetchMore }
}
