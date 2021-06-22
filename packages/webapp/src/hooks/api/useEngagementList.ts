/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, gql, useMutation, useSubscription } from '@apollo/client'
import { ApiResponse } from './types'
import type {
	AuthenticationResponse,
	Engagement,
	EngagementInput
} from '@greenlight/schema/lib/client-types'
import { EngagementFields } from './fragments'
import { get } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { userAuthState, engagementListState, myEngagementListState } from '~store'
import { useEffect } from 'react'
import sortByDate from '~utils/sortByDate'

export const GET_ENGAGEMENTS = gql`
	${EngagementFields}

	query engagements(
		$orgId: String!
		$offset: Int
		$limit: Int
		$userId: String
		$exclude_userId: Boolean
	) {
		engagements(
			orgId: $orgId
			offset: $offset
			limit: $limit
			userId: $userId
			exclude_userId: $exclude_userId
		) {
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

export const SUBSCRIBE_TO_ORG_ENGAGEMENTS = gql`
	${EngagementFields}

	subscription engagementUpdated($orgId: String!) {
		engagementUpdate(orgId: $orgId) {
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
	engagementList: Engagement[]
	myEngagementList: Engagement[]
}

// FIXME: update to only have ONE input as an object
export function useEngagementList(orgId: string, userId: string): useEngagementListReturn {
	// Local user
	const authUser = useRecoilValue<AuthenticationResponse | null>(userAuthState)

	// Store used to save engagements list
	const [engagementList, setEngagmentList] = useRecoilState<Engagement[] | null>(
		engagementListState
	)
	const [myEngagementList, setMyEngagmentList] = useRecoilState<Engagement[] | null>(
		myEngagementListState
	)

	// Engagements query
	const { loading, error, data, refetch, fetchMore } = useQuery(GET_ENGAGEMENTS, {
		variables: { orgId, offset: 0, limit: 800 },
		fetchPolicy: 'cache-and-network'
	})

	// Create engagements mutation
	const [createEngagement] = useMutation(CREATE_ENGAGEMENT)
	const [updateEngagement] = useMutation(UPDATE_ENGAGEMENT)

	// Subscribe to engagement updates
	const { error: subscriptionError } = useSubscription(SUBSCRIBE_TO_ORG_ENGAGEMENTS, {
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
						removeEnagementFromList(engagementUpdate)
						break
					case 'UPDATE':
						updateEnagementInList(engagementUpdate)
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
		const isMyEngagement = !!euid && euid === authUser.user.id
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
		if (isMyEngagement) setMyEngagmentList(nextEngagementList)
		else setEngagmentList(nextEngagementList)
	}

	// Helper funtion to remove engagement to local store
	const removeEnagementFromList = (engagement: Engagement) => {
		// Check which list to add to
		if (!engagement) throw new Error('Mark complete failed')

		const engagementListIndex = engagementList.findIndex(e => e.id === engagement.id)
		if (engagementListIndex > -1) {
			setEngagmentList([
				...engagementList.slice(0, engagementListIndex),
				...engagementList.slice(engagementListIndex + 1)
			])
		}
		const myEngagementListIndex = myEngagementList.findIndex(e => e.id === engagement.id)
		if (myEngagementListIndex > -1) {
			setMyEngagmentList([
				...myEngagementList.slice(0, myEngagementListIndex),
				...myEngagementList.slice(myEngagementListIndex + 1)
			])
		}
	}

	// Helper funtion to update engagement in local store
	const updateEnagementInList = (engagement: Engagement) => {
		// If updated list element currently exists in engagement list
		const engagementIdx = engagementList.findIndex(e => e.id === engagement.id)

		// Engagement in engagementList
		if (engagementIdx > -1) {
			if (engagement.user?.id === authUser.user.id) {
				// Remove engagement from engList add to myEngList
				setEngagmentList([
					...engagementList.slice(0, engagementIdx),
					...engagementList.slice(engagementIdx + 1)
				])
				setMyEngagmentList(
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

				setEngagmentList(
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

			setMyEngagmentList(
				[...nextEngagementList, engagement].sort((a, b) =>
					sortByDate({ date: a.startDate }, { date: b.startDate })
				)
			)
		}
	}

	// Listen for engagements loaded
	useEffect(() => {
		if (data?.engagements) {
			const [myEngagementListNext, engagmentListNext] = seperateEngagements(
				userId,
				data?.engagements
			)
			setEngagmentList(engagmentListNext)
			setMyEngagmentList(myEngagementListNext)
		} else {
			setEngagmentList([])
			setMyEngagmentList([])
		}
	}, [data, userId, setEngagmentList, setMyEngagmentList])

	// Listen for errors on load engagements
	useEffect(() => {
		if (error) {
			console.error('error loading data', error)
		}
	}, [error])

	const engagementData: Engagement[] = !loading && (data?.engagements as Engagement[])

	// Wrapper around create engagement mutator
	const addEngagement = async (engagementInput: EngagementInput) => {
		const orgId = get(authUser, 'user.roles[0].orgId')

		const nextEngagement = {
			...engagementInput,
			orgId
		}

		// execute mutator
		await createEngagement({
			variables: {
				body: nextEngagement
			}
		})
	}

	const editEngagement = async (engagementInput: EngagementInput) => {
		const orgId = get(authUser, 'user.roles[0].orgId')

		const engagement = {
			...engagementInput,
			orgId
		}

		// execute mutator
		await updateEngagement({
			variables: {
				body: engagement
			}
		})
	}

	return {
		loading,
		error,
		refetch,
		fetchMore,
		addEngagement,
		editEngagement,
		engagementList,
		myEngagementList,
		data: engagementData
	}
}
