/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import type {
	EngagementInput,
	MutationCreateEngagementArgs,
	Engagement
} from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from '~hooks/api/useCurrentUser'
import { GET_USER_ACTIVES_ENGAGEMENTS } from '~queries'

const CREATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation createEngagement($engagement: EngagementInput!) {
		createEngagement(engagement: $engagement) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export type AddEngagementCallback = (e: EngagementInput) => void

export function useAddEngagementCallback(orgId: string): AddEngagementCallback {
	const { c } = useTranslation(Namespace.Common)
	const { success, failure } = useToasts()
	const { userId } = useCurrentUser()
	const [createEngagement] = useMutation<any, MutationCreateEngagementArgs>(CREATE_ENGAGEMENT)

	return useCallback(
		(engagementInput: EngagementInput) => {
			const optimisticResponse = {
				createEngagement: {
					message: 'Success',
					engagement: {
						id: 'LOCAL_' + crypto.randomUUID(), // Random ID that will be replaced by the server version
						orgId: orgId,
						title: engagementInput.title,
						description: engagementInput.description,
						status: engagementInput.userId ? 'ASSIGNED' : 'OPEN',
						startDate: Date.now(), // TODO: This should be set by the front-end, not the back-end...
						endDate: engagementInput.endDate ?? null,
						user: null,
						tags: engagementInput.tags ?? [],
						contacts: [],
						actions: [],
						__typename: 'Engagement'
					},
					__typename: 'EngagementResponse'
				}
			}

			function update(cache, result) {
				// optimisticResponse or serverResponse
				const newEngagement: Engagement = result.data.createEngagement.engagement

				// Fetch all the activeEngagements
				const queryOptions = {
					overwrite: true,
					variables: { orgId, userId },
					query: GET_USER_ACTIVES_ENGAGEMENTS
				}

				// Now we combine the newEngagement we passed in earlier with the existing data
				const addOptimisticResponse = (data) => {
					if (data) {
						let { activeEngagements, userActiveEngagements } = data

						if (engagementInput.userId === userId) {
							userActiveEngagements = userActiveEngagements.filter((e) => e.id !== newEngagement.id)
							userActiveEngagements = [...userActiveEngagements, newEngagement]
						} else {
							activeEngagements = activeEngagements.filter((e) => e.id !== newEngagement.id)
							activeEngagements = [...activeEngagements, newEngagement]
						}

						return { activeEngagements, userActiveEngagements }
					}
				}

				cache.updateQuery(queryOptions, addOptimisticResponse)
			}

			createEngagement({
				optimisticResponse,
				onCompleted: () => success(c('hooks.useEngagementList.addEngagement.success')),
				onError: (e) => failure(c('hooks.useEngagementList.addEngagement.failed'), e.message),
				update,
				variables: { engagement: { ...engagementInput, orgId } }
			})
		},
		[orgId, success, failure, c, createEngagement, userId]
	)
}
