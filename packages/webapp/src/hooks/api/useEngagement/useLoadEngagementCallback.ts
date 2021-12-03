/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLazyQuery, gql, ApolloQueryResult } from '@apollo/client'
import { Engagement } from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { useTranslation } from '~hooks/useTranslation'
import { engagementState } from '~store'
import { useRecoilState } from 'recoil'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useEngagement')

const GET_ENGAGEMENT = gql`
	${EngagementFields}

	query engagement($engagementId: String!) {
		engagement(engagementId: $engagementId) {
			...EngagementFields
		}
	}
`
export type LoadEngagementCallback = (engagementId: string) => void

export function useLoadEngagementCallback(): {
	load: LoadEngagementCallback
	loading: boolean
	error: Error
	refetch?: (variables: Record<string, any>) => Promise<ApolloQueryResult<any>>
} {
	const { c } = useTranslation()
	const [, setEngagementData] = useRecoilState<Engagement | undefined>(engagementState)
	const [executeLoad, { loading, error, refetch }] = useLazyQuery(GET_ENGAGEMENT, {
		onCompleted: (data) => {
			if (data?.engagement) {
				setEngagementData(data.engagement)
			}
		},
		onError: (error) => {
			logger(c('hooks.useEngagement.loadData.failed'), error)
		}
	})

	const load = useCallback(
		(engagementId: string) => {
			executeLoad({ variables: { engagementId } })
		},
		[executeLoad]
	)

	return {
		load,
		loading,
		error,
		refetch
	}
}
