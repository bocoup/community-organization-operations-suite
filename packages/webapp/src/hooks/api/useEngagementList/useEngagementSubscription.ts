/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useSubscription } from '@apollo/client'
import { EngagementFields } from '../fragments'
import { get } from 'lodash'
import {
	Engagement,
	EngagementResponse,
	SubscriptionEngagementsArgs
} from '@cbosuite/schema/dist/client-types'
import { engagementListState, myEngagementListState } from '~store'
import { useCurrentUser } from '../useCurrentUser'
import { useRecoilState } from 'recoil'
import { sortByDate } from '~utils/sortByDate'
import { Namespace, useTranslation } from '~hooks/useTranslation'
import { useEffect } from 'react'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('useEngagementList')

export const SUBSCRIBE_TO_ORG_ENGAGEMENTS = gql`
	${EngagementFields}

	subscription engagementUpdate($orgId: String!) {
		engagements(orgId: $orgId) {
			message
			action
			engagement {
				...EngagementFields
			}
		}
	}
`

export function useEngagementSubscription(orgId?: string) {
	const { c } = useTranslation(Namespace.Common)

	// Store used to save engagements list
	const [engagementList, setEngagementList] = useRecoilState<Engagement[]>(engagementListState)
	const [myEngagementList, setMyEngagementList] =
		useRecoilState<Engagement[]>(myEngagementListState)

	// Local user
	const { userId: currentUserId } = useCurrentUser()

	// Helper funtion to add engagement to local store
	const addEngagementToList = (engagement: Engagement) => {
		// Check which list to add to
		const isMyEngagement = isCurrentUserEngagement(engagement, currentUserId)

		// Update local list
		const nextEngagementList: Engagement[] = [
			engagement,
			...(isMyEngagement ? myEngagementList : engagementList)
		].sort((a, b) => sortByDate({ date: a.startDate }, { date: b.startDate }))

		// Set recoil variable
		if (isMyEngagement) setMyEngagementList(nextEngagementList)
		else setEngagementList(nextEngagementList)
	}

	// Helper funtion to remove engagement to local store
	const removeEngagementFromList = (engagement: Engagement) => {
		// Check which list to add to
		if (!engagement) throw new Error(c('hooks.useEngagementList.remove.failed'))

		const engagementListIndex = engagementList.findIndex((e) => e.id === engagement.id)
		if (engagementListIndex > -1) {
			setEngagementList([
				...engagementList.slice(0, engagementListIndex),
				...engagementList.slice(engagementListIndex + 1)
			])
		}
		const myEngagementListIndex = myEngagementList.findIndex((e) => e.id === engagement.id)
		if (myEngagementListIndex > -1) {
			setMyEngagementList([
				...myEngagementList.slice(0, myEngagementListIndex),
				...myEngagementList.slice(myEngagementListIndex + 1)
			])
		}
	}

	// Helper funtion to update engagement in local store
	const updateEngagementInList = (engagement: Engagement) => {
		// If updated list element currently exists in engagement list
		const engagementIdx = engagementList.findIndex((e) => e.id === engagement.id)

		// Engagement in engagementList
		if (engagementIdx > -1) {
			if (engagement.user?.id === currentUserId) {
				// Remove engagement from engList add to myEngList
				setEngagementList([
					...engagementList.slice(0, engagementIdx),
					...engagementList.slice(engagementIdx + 1)
				])
				setMyEngagementList(
					[...myEngagementList, engagement].sort((a, b) =>
						sortByDate({ date: a.startDate }, { date: b.startDate })
					)
				)
			} else {
				// Replace engagement in list
				const nextEngagementList = [
					...engagementList.slice(0, engagementIdx),
					...engagementList.slice(engagementIdx + 1)
				]

				setEngagementList(
					[...nextEngagementList, engagement].sort((a, b) =>
						sortByDate({ date: a.startDate }, { date: b.startDate })
					)
				)
			}
		}

		const myEngagementIdx = myEngagementList.findIndex((e) => e.id === engagement.id)
		if (myEngagementIdx > -1) {
			// Replace engagement in list
			const nextEngagementList = [
				...myEngagementList.slice(0, myEngagementIdx),
				...myEngagementList.slice(myEngagementIdx + 1)
			]

			setMyEngagementList(
				[...nextEngagementList, engagement].sort((a, b) =>
					sortByDate({ date: a.startDate }, { date: b.startDate })
				)
			)
		}
	}

	// Subscribe to engagement updates
	const { error: subscriptionError } = useSubscription<
		EngagementResponse,
		SubscriptionEngagementsArgs
	>(SUBSCRIBE_TO_ORG_ENGAGEMENTS, {
		variables: { orgId },
		onSubscriptionData: ({ subscriptionData }) => {
			// Update subscriptions here
			const updateType = get(subscriptionData, 'data.engagementUpdate.action')
			const engagementUpdate = get(subscriptionData, 'data.engagementUpdate.engagement')

			// If the subscription updated sucessfully
			if (engagementUpdate) {
				// Handle socket update
				switch (updateType) {
					case 'CREATED':
						addEngagementToList(engagementUpdate)
						break
					case 'CLOSED':
					case 'COMPLETED':
						removeEngagementFromList(engagementUpdate)
						break
					case 'UPDATE':
						updateEngagementInList(engagementUpdate)
						break
				}
			}
		}
	})

	// Listen for errors to enagementUpdates subsciption
	useEffect(() => {
		if (subscriptionError) {
			logger('subscriptionError', subscriptionError)
		}
	}, [subscriptionError])
}

// Function to determine if the engagement belongs to the current user
function isCurrentUserEngagement(engagement: Engagement, currentUserId: string): boolean {
	const euid = engagement.user?.id
	const isMyEngagement = !!euid && euid === currentUserId
	return isMyEngagement
}
