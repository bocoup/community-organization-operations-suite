/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useSubscription } from '@apollo/client'
import { currentUserState } from '~store'
import { MentionFields } from './fragments'
import { useRecoilState } from 'recoil'
import type { User } from '@greenlight/schema/lib/client-types'
import { get } from 'lodash'
import { useEffect } from 'react'

export const SUBSCRIBE_TO_MENTIONS = gql`
	${MentionFields}

	subscription subscribeToMentions($userId: String!) {
		subscribeToMentions(userId: $userId) {
			message
			action
			mention {
				...MentionFields
			}
		}
	}
`

/**
 * Subscribes to mentions and updates the current user state
 * @returns {void} nothing
 */
export function useSubscribeToMentions(): void {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)

	const addMentionToList = mention => {
		const mentions = [...currentUser.mentions]
		mentions.unshift(mention)
		setCurrentUser({ ...currentUser, mentions })
	}

	const { error } = useSubscription(SUBSCRIBE_TO_MENTIONS, {
		variables: {
			userId: currentUser.id
		},
		skip: !currentUser?.id,
		onSubscriptionData: ({ subscriptionData }) => {
			// Update subscriptions here
			const updateType = get(subscriptionData, 'data.subscribeToMentions.action')
			const mention = get(subscriptionData, 'data.subscribeToMentions.mention')

			// If the subscription updated sucessfully
			if (mention) {
				// Handle socket update
				switch (updateType) {
					case 'CREATED':
						addMentionToList(mention)
						break
					default:
						console.error('Mention subscription recieved without updateType')
						break
				}
			}
		}
	})

	useEffect(() => {
		if (error) console.error('Error subscribing to mentions', error)
	}, [error])
}
