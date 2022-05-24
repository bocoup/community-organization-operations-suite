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
import { GET_ENGAGEMENTS } from '../useEngagementList/useEngagementListData'

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
	const [createEngagement] = useMutation<any, MutationCreateEngagementArgs>(CREATE_ENGAGEMENT)

	return useCallback(
		(engagementInput: EngagementInput) => {
			//console.log(engagementInput)
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
							status: 'OPEN', // Keep the default for creation
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
				// data is where we can access the optimisticResponse we passed in earlier
				update: (cache, { data }) => {
					// Get the current cached data.
					const engagements = cache.readQuery({
						// The cached query key is the same as the name of the GQL schema
						query: GET_ENGAGEMENTS
					}) as any

					// Now we combine the optimisticResponse we passed in earlier and the existing data
					const newEngagements = [
						data.createEngagement.engagement,
						...engagements.activeEngagements
					]
					//console.log({engagements, newEngagements})
					// Finally we overwrite the cache
					// cache.writeQuery({
					//   query: GET_ENGAGEMENTS,
					//   data: { getPosts: newEngagements },
					// })
				}
			})
				.then(() => success(c('hooks.useEngagementList.addEngagement.success')))
				.catch((error) => failure(c('hooks.useEngagementList.addEngagement.failed'), error))
		},
		[orgId, success, failure, c, createEngagement]
	)
}
