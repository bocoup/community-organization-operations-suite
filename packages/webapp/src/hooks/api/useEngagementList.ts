/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLazyQuery, gql, useMutation, useSubscription } from '@apollo/client'
import { ApiResponse } from './types'
import useToasts from '~hooks/useToasts'

import type { Engagement, EngagementInput } from '@resolve/schema/lib/client-types'
import { EngagementFields } from './fragments'
import { get } from 'lodash'
import { useRecoilState } from 'recoil'
import { engagementListState, myEngagementListState } from '~store'
import { useEffect } from 'react'
import sortByDate from '~utils/sortByDate'
import { useTranslation } from '~hooks/useTranslation'
import { useCurrentUser } from './useCurrentUser'

export const GET_ENGAGEMENTS = gql`
	${EngagementFields}

	query activeEngagements($body: EngagementsInput!) {
		activeEngagements(body: $body) {
			...EngagementFields
		}
	}
`

export const CREATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation createEngagement($body: EngagementInput!) {
		createEngagement(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export const UPDATE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation updateEngagement($body: EngagementInput!) {
		updateEngagement(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const ASSIGN_ENGAGEMENT = gql`
	${EngagementFields}

	mutation assignEngagement($body: EngagementUserInput!) {
		assignEngagement(body: $body) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

export const SUBSCRIBE_TO_ORG_ENGAGEMENTS = gql`
	${EngagementFields}

	subscription engagementUpdate($body: OrganizationIdInput!) {
		engagementUpdate(body: $body) {
			message
			action
			engagement {
				...EngagementFields
			}
		}
	}
`

const seperateEngagements = (
	userId: string,
	engagements?: Engagement[]
): Array<Array<Engagement>> => {
	if (!engagements) return [[], []]

	const [currUserEngagements, otherEngagements] = engagements.reduce(
		(r, e) => {
			if (!!e.user?.id && e.user.id === userId) {
				r[0].push(e)
			} else {
				r[1].push(e)
			}

			return r
		},
		[[], []]
	)

	return [currUserEngagements, otherEngagements]
}

interface useEngagementListReturn extends ApiResponse<Engagement[]> {
	addEngagement: (form: any) => Promise<void>
	editEngagement: (form: any) => Promise<void>
	claimEngagement: (id: string, userId: string) => Promise<void>
	engagementList: Engagement[]
	myEngagementList: Engagement[]
}

// FIXME: update to only have ONE input as an object
export function useEngagementList(orgId?: string, userId?: string): useEngagementListReturn {
	const { c } = useTranslation('common')
	const { success, failure } = useToasts()

	// Local user
	const { userId: currentUserId, orgId: currentOrgId } = useCurrentUser()

	// Store used to save engagements list
	const [engagementList, setEngagementList] = useRecoilState<Engagement[] | null>(
		engagementListState
	)
	const [myEngagementList, setMyEngagementList] = useRecoilState<Engagement[] | null>(
		myEngagementListState
	)

	// Engagements query
	const [load, { loading, error, refetch, fetchMore }] = useLazyQuery(GET_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: data => {
			if (data?.activeEngagements && userId) {
				const [myEngagementListNext, engagementListNext] = seperateEngagements(
					userId,
					data?.activeEngagements
				)

				const sortByDuration = (a: Engagement, b: Engagement) => {
					const currDate = new Date()
					const aDate = a?.endDate ? new Date(a.endDate) : currDate
					const bDate = b?.endDate ? new Date(b.endDate) : currDate

					const aDuration = currDate.getTime() - aDate.getTime()
					const bDuration = currDate.getTime() - bDate.getTime()

					return aDuration > bDuration ? -1 : 1
				}

				setEngagementList(engagementListNext.sort(sortByDuration))
				setMyEngagementList(myEngagementListNext.sort(sortByDuration))
			}
		},
		onError: error => {
			if (error) {
				console.error(c('hooks.useEngagementList.loadData.failed'), error)
			}
		}
	})

	useEffect(() => {
		if (orgId) {
			load({ variables: { body: { orgId, offset: 0, limit: 800 } } })
		}
	}, [orgId, load])

	// Create engagements mutation
	const [createEngagement] = useMutation(CREATE_ENGAGEMENT)
	const [updateEngagement] = useMutation(UPDATE_ENGAGEMENT)
	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)

	// Subscribe to engagement updates
	const { error: subscriptionError } = useSubscription(SUBSCRIBE_TO_ORG_ENGAGEMENTS, {
		variables: { body: { orgId } },
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
		if (subscriptionError) console.error('subscriptionError', subscriptionError)
	}, [subscriptionError])

	// Function to determine if the engagement belongs to the current user
	const isCurrentUserEngagement = (engagement: Engagement): boolean => {
		const euid = engagement.user?.id
		const isMyEngagement = !!euid && euid === currentUserId
		return isMyEngagement
	}

	// Helper funtion to add engagement to local store
	const addEngagementToList = (engagement: Engagement) => {
		// Check which list to add to
		const isMyEngagement = isCurrentUserEngagement(engagement)

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

		const engagementListIndex = engagementList.findIndex(e => e.id === engagement.id)
		if (engagementListIndex > -1) {
			setEngagementList([
				...engagementList.slice(0, engagementListIndex),
				...engagementList.slice(engagementListIndex + 1)
			])
		}
		const myEngagementListIndex = myEngagementList.findIndex(e => e.id === engagement.id)
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
		const engagementIdx = engagementList.findIndex(e => e.id === engagement.id)

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

		const myEngagementIdx = myEngagementList.findIndex(e => e.id === engagement.id)
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

	// Wrapper around create engagement mutator
	const addEngagement = async (engagementInput: EngagementInput) => {
		const orgId = currentOrgId

		const nextEngagement = {
			...engagementInput,
			orgId
		}
		try {
			// execute mutator
			await createEngagement({
				variables: {
					body: nextEngagement
				}
			})

			success(c('hooks.useEngagementList.addEngagement.success'))
		} catch (error) {
			failure(c('hooks.useEngagementList.addEngagement.failed'), error)
		}
	}

	const editEngagement = async (engagementInput: EngagementInput) => {
		const orgId = currentOrgId

		const engagement = {
			...engagementInput,
			orgId
		}

		try {
			// execute mutator
			await updateEngagement({
				variables: {
					body: engagement
				}
			})

			success(c('hooks.useEngagementList.editEngagement.success'))
		} catch (error) {
			failure(c('hooks.useEngagementList.editEngagement.failed'), error)
		}
	}

	const claimEngagement = async (id: string, userId: string) => {
		try {
			await assignEngagement({
				variables: { body: { engId: id, userId } }
			})

			success(c('hooks.useEngagementList.claimEngagement.success'))
		} catch (error) {
			failure(c('hooks.useEngagementList.claimEngagement.failed'), error)
		}
	}

	return {
		loading,
		error,
		refetch,
		fetchMore,
		addEngagement,
		editEngagement,
		claimEngagement,
		engagementList,
		myEngagementList
	}
}
