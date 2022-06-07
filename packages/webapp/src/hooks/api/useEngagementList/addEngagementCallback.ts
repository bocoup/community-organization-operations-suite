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
	const { userId } = useCurrentUser()
	const { success, failure } = useToasts()
	const [createEngagement] = useMutation<any, MutationCreateEngagementArgs>(CREATE_ENGAGEMENT)

	return useCallback(
		(engagementInput: EngagementInput) => {
			createEngagement({
				variables: { engagement: { ...engagementInput, orgId } },
				optimisticResponse: {
					createEngagement: {
						message: 'Success',
						engagement: {
							id: 'test', // crypto.randomUUID(), // Random ID that will be replaced by the server version
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
				},
				update: (cache, result) => {
					// optimisticResponse or serverResponse
					const newEngagement: Engagement = result.data.createEngagement.engagement

					// Fetch all the activeEngagements
					const queryOptions = {
						query: GET_USER_ACTIVES_ENGAGEMENTS,
						variables: { orgId, userId }
					}

					// Now we combine the newEngagement we passed in earlier with the existing data
					const addOptimisticResponse = (data) => {
						if (data) {
							if (engagementInput.userId === userId) {
								return {
									activeEngagements: data.activeEngagements,
									userActiveEngagements: [...data.userActiveEngagements, newEngagement]
								}
							} else {
								return {
									activeEngagements: [...data.activeEngagements, newEngagement],
									userActiveEngagements: data.userActiveEngagements
								}
							}
						}
					}

					cache.updateQuery(queryOptions, addOptimisticResponse)
				}
			})
				.then(() => success(c('hooks.useEngagementList.addEngagement.success')))
				.catch((error) => failure(c('hooks.useEngagementList.addEngagement.failed'), error))
		},
		[orgId, success, failure, c, createEngagement, userId]
	)
}
