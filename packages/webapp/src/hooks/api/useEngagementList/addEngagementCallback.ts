/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useApolloClient, useMutation } from '@apollo/client'
import { useToasts } from '~hooks/useToasts'
import type {
	EngagementInput,
	MutationCreateEngagementArgs,
	Engagement
} from '@cbosuite/schema/dist/client-types'
import { ContactFields, UserFields } from '../fragments'
import { useCallback } from 'react'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { CREATE_ENGAGEMENT, GET_ENGAGEMENTS } from '~queries'

export type AddEngagementCallback = (e: EngagementInput) => void

export function useAddEngagementCallback(orgId: string): AddEngagementCallback {
	const { c } = useTranslation(Namespace.Common)
	const { success, failure } = useToasts()
	const [createEngagement] = useMutation<any, MutationCreateEngagementArgs>(CREATE_ENGAGEMENT)
	const apolloClient = useApolloClient()

	return useCallback(
		(engagementInput: EngagementInput) => {
			const user = apolloClient.readFragment({
				id: `User:${engagementInput.userId}`,
				fragment: UserFields
			})

			const contacts = engagementInput.contactIds.map((contactId) => {
				return apolloClient.readFragment({
					id: `Contact:${contactId}`,
					fragment: ContactFields
				})
			})

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
						user: user,
						tags: engagementInput.tags ?? [],
						contacts: contacts,
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
					variables: { orgId },
					query: GET_ENGAGEMENTS
				}

				// Now we combine the newEngagement we passed in earlier with the existing data
				const addOptimisticResponse = (data) => {
					if (data) {
						return { allEngagements: [...data.allEngagements, newEngagement] }
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
		[apolloClient, c, createEngagement, failure, orgId, success]
	)
}
