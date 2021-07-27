/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useLazyQuery } from '@apollo/client'
import { ContactEngagement } from '@resolve/schema/lib/client-types'
import { ApiResponse } from './types'
import { contactEngagementListState } from '~store'
import { useRecoilState } from 'recoil'
import { ContactEngagementFields } from './fragments'
import { useCallback } from 'react'

export const GET_CONTACT_ACTIVE_ENGAGEMENTS = gql`
	${ContactEngagementFields}
	query contactActiveEngagements($body: ContactIdInput!) {
		contactActiveEngagements(body: $body) {
			...ContactEngagementFields
		}
	}
`

interface useContactEngagementListReturn extends ApiResponse<ContactEngagement> {
	contactActiveEngagementList: ContactEngagement[] | null
	loadContactEngagements: (id: string) => void
}

export function useContactEngagementList(): useContactEngagementListReturn {
	const [contactActiveEngagementList, setContactActiveEngagementList] = useRecoilState<
		ContactEngagement[]
	>(contactEngagementListState)

	const [load, { loading, error }] = useLazyQuery(GET_CONTACT_ACTIVE_ENGAGEMENTS, {
		fetchPolicy: 'cache-and-network',
		onCompleted: data => {
			if (data?.contactActiveEngagements) {
				setContactActiveEngagementList(data.contactActiveEngagements)
			}
		},
		onError: error => {
			console.error('Load data failed', error)
		}
	})

	const loadContactEngagements: useContactEngagementListReturn['loadContactEngagements'] =
		useCallback(
			id => {
				load({ variables: { body: { contactId: id } } })
			},
			[load]
		)

	return {
		loading,
		error,
		contactActiveEngagementList,
		loadContactEngagements
	}
}
