/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import { Service } from '@cbosuite/schema/dist/client-types'
import { serviceListState } from '~store'
import { useRecoilState } from 'recoil'
import { useCallback, useEffect } from 'react'
import { ServiceFields } from '../fragments'
import { useTranslation } from '~hooks/useTranslation'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useServiceList')

const GET_SERVICES = gql`
	${ServiceFields}
	query services($body: OrganizationIdInput!) {
		services(body: $body) {
			...ServiceFields
		}
	}
`

export function useLoadServicesCallback(orgId?: string) {
	const { c } = useTranslation()
	const [, setServiceList] = useRecoilState<Service[]>(serviceListState)
	const [executeLoad, { loading, error, refetch, fetchMore }] = useLazyQuery(GET_SERVICES, {
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			if (data?.services) {
				setServiceList(data.services)
			}
		},
		onError: (error) => {
			if (error) {
				logger(c('hooks.useServicelist.loadDataFailed'), error)
			}
		}
	})

	const load = useCallback(() => {
		executeLoad({ variables: { body: { orgId } } })
	}, [executeLoad, orgId])

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
