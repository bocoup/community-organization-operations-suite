/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import type {
	EngagementInput,
	MutationCreateEngagementArgs
} from '@cbosuite/schema/dist/client-types'
import { EngagementFields } from '../fragments'
import { useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'

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

const ACTIVE_ENGAGEMENTS = gql`
	${EngagementFields}
	query activeEngagements($orgId: String!) {
		activeEngagements(orgId: $orgId) {
			...EngagementFields
		}
	}
`

export type AddEngagementCallback = (e: EngagementInput) => void

export function useAddEngagementCallback(orgId: string): AddEngagementCallback {
	const { c } = useTranslation(Namespace.Common)
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
							id: crypto.randomUUID(),
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
					const newEngagement = result.data.createEngagement.engagement
					// console.log(newEngagement)

					// Fetch all the activeEngagements
					const queryOptions = {
						query: ACTIVE_ENGAGEMENTS,
						variables: { orgId: orgId }
					}

					// Now we combine the newEngagement we passed in earlier with the existing data
					const addOptimisticResponse = (data) => {
						// console.log(data)
						if (data) {
							return {
								activeEngagements: [...data.activeEngagements, newEngagement]
							}
						}
					}

					cache.updateQuery(queryOptions, addOptimisticResponse)
				}
			})
				.then(() => success(c('hooks.useEngagementList.addEngagement.success')))
				.catch((error) => failure(c('hooks.useEngagementList.addEngagement.failed'), error))
		},
		[orgId, success, failure, c, createEngagement]
	)
}
