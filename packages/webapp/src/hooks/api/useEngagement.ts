/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useQuery, useMutation, gql } from '@apollo/client'
import { ApiResponse } from './types'
import type {
	Engagement,
	EngagementStatus,
	AuthenticationResponse
} from '@greenlight/schema/lib/client-types'
import { GET_ENGAGEMENTS } from './useEngagementList'
import { EngagementFields } from './fragments'
import { useRecoilState } from 'recoil'
import { engagementListState, myEngagementListState, userAuthState } from '~store'
import { get } from 'lodash'
import sortByDate from '~utils/sortByDate'

const GET_ENGAGEMENT = gql`
	${EngagementFields}

	query engagement($id: String!) {
		engagement(id: $id) {
			...EngagementFields
		}
	}
`

const ASSIGN_ENGAGEMENT = gql`
	${EngagementFields}

	mutation assignEngagement($userId: String!, $id: String!) {
		assignEngagement(userId: $userId, id: $id) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const SET_ENGAGEMENT_STATUS = gql`
	${EngagementFields}

	mutation setEngagementStatus($id: String!, $status: EngagementStatus!) {
		setEngagementStatus(id: $id, status: $status) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const COMPLETE_ENGAGEMENT = gql`
	${EngagementFields}

	mutation completeEngagement($id: String!) {
		completeEngagement(id: $id) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

const ADD_ENGAGEMENT_ACTION = gql`
	${EngagementFields}

	mutation addEngagementAction($id: String!, $action: ActionInput!) {
		addEngagementAction(id: $id, action: $action) {
			message
			engagement {
				...EngagementFields
			}
		}
	}
`

interface useEngagementReturn extends ApiResponse<Engagement> {
	assign: (userId: string) => void
	setStatus: (status: EngagementStatus) => void
	addAction: (action: { comment: string; taggedUserId?: string; tags?: string[] }) => void
	completeEngagement: () => void
}

export function useEngagement(id: string, orgId: string): useEngagementReturn {
	const { loading, error, data, refetch } = useQuery(GET_ENGAGEMENT, {
		variables: { id }
	})
	const [authUser] = useRecoilState<AuthenticationResponse | null>(userAuthState)
	const [assignEngagement] = useMutation(ASSIGN_ENGAGEMENT)
	const [setEngagementStatus] = useMutation(SET_ENGAGEMENT_STATUS)
	const [addEngagementAction] = useMutation(ADD_ENGAGEMENT_ACTION)
	const [markEngagementComplete] = useMutation(COMPLETE_ENGAGEMENT)

	const [engagementList, setEngagmentList] = useRecoilState<Engagement[] | null>(
		engagementListState
	)
	const [myEngagementList, setMyEngagmentList] = useRecoilState<Engagement[] | null>(
		myEngagementListState
	)

	if (error) {
		console.error('error loading data', error)
	}

	const engagementData: Engagement = !loading && (data?.engagement as Engagement)

	const assign = async (userId: string) => {
		// execute mutator
		await assignEngagement({
			variables: {
				userId,
				id
			},
			update(cache, { data }) {
				if (!data?.assignEngagement?.engagement) throw new Error('Error assigning engagement')

				const updatedEng: Engagement = data.assignEngagement.engagement

				const engagementIdx = engagementList.findIndex(e => e.id === updatedEng.id)

				// Engagement in all engList
				if (engagementIdx > -1) {
					if (updatedEng.user?.id === authUser.user.id) {
						// Remove engagement from engList add to myEngList

						setEngagmentList([
							...engagementList.slice(0, engagementIdx),
							...engagementList.slice(engagementIdx + 1)
						])
						setMyEngagmentList([...myEngagementList, updatedEng].sort(sortByDate))
					}
				}
			}
		})
	}

	const setStatus = async (status: EngagementStatus) => {
		// execute mutator
		await setEngagementStatus({
			variables: {
				id,
				status
			},
			update(cache, { data }) {
				const updatedID = data.setEngagementStatus.engagement.id
				const existingEngagements = cache.readQuery({
					query: GET_ENGAGEMENTS,
					variables: { orgId, limit: 30 }
				}) as { engagements: Engagement[] }

				const newEngagements = existingEngagements?.engagements.map(e => {
					if (e.id === updatedID) {
						return data.setEngagementStatus.engagement
					}
					return e
				})

				cache.writeQuery({
					query: GET_ENGAGEMENTS,
					variables: { orgId, limit: 30 },
					data: { engagements: newEngagements }
				})

				cache.writeQuery({
					query: GET_ENGAGEMENT,
					variables: { id: updatedID },
					data: { engagement: data.setEngagementStatus.engagement }
				})
			}
		})
	}

	const addAction = async action => {
		const userId = get(authUser, 'user.id')
		const orgId = get(authUser, 'user.roles[0].orgId')
		const nextAction = {
			...action,
			userId,
			orgId
		}

		// execute mutator
		await addEngagementAction({
			variables: {
				id,
				action: nextAction
			}
		})
	}

	const completeEngagement = async () => {
		await markEngagementComplete({
			variables: {
				id
			},
			update(_, { data }) {
				const updatedEng = data?.completeEngagement?.engagement
				if (!updatedEng) throw new Error('Mark complete failed')

				const engagementListIndex = engagementList.findIndex(e => e.id === updatedEng.id)
				if (engagementListIndex > -1) {
					setEngagmentList([
						...engagementList.slice(0, engagementListIndex),
						...engagementList.slice(engagementListIndex + 1)
					])
				}
				const myEngagementListIndex = myEngagementList.findIndex(e => e.id === updatedEng.id)
				if (myEngagementListIndex > -1) {
					setMyEngagmentList([
						...myEngagementList.slice(0, myEngagementListIndex),
						...myEngagementList.slice(myEngagementListIndex + 1)
					])
				}
			}
		})
	}

	return {
		loading,
		error,
		refetch,
		assign,
		setStatus,
		addAction,
		completeEngagement,
		data: engagementData
	}
}
