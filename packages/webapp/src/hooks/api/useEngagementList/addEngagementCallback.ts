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
import { useRecoilState } from 'recoil'
import { engagementListState, myEngagementListState } from '~store'

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

	// Store used to save engagements list
	const [engagementList, setEngagementList] = useRecoilState<Engagement[]>(engagementListState)
	const [myEngagementList, setMyEngagementList] =
		useRecoilState<Engagement[]>(myEngagementListState)

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
					const newEngagement: Engagement = result.data.createEngagement.engagement

					// Fetch all the activeEngagements
					const queryOptions = {
						query: GET_USER_ACTIVES_ENGAGEMENTS,
						variables: { orgId: orgId, userId: engagementInput.userId }
					}

					// Now we combine the newEngagement we passed in earlier with the existing data
					const addOptimisticResponse = (data) => {
						if (data) {
							const { activeEngagements, userActiveEngagements } = data

							if (engagementInput.userId === userId) {
								userActiveEngagements.push(newEngagement)
								setMyEngagementList([...myEngagementList, newEngagement])
							} else {
								activeEngagements.push(newEngagement)
								setEngagementList([...engagementList, newEngagement])
							}

							return {
								activeEngagements,
								userActiveEngagements
							}
						}
					}

					cache.updateQuery(queryOptions, addOptimisticResponse)
				}
			})
				.then(() => success(c('hooks.useEngagementList.addEngagement.success')))
				.catch((error) => failure(c('hooks.useEngagementList.addEngagement.failed'), error))
		},
		[
			orgId,
			success,
			failure,
			c,
			createEngagement,
			engagementList,
			myEngagementList,
			setEngagementList,
			setMyEngagementList,
			userId
		]
	)
}
