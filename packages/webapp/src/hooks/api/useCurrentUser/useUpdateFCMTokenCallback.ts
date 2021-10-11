/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { useCallback } from 'react'

export type UpdateFCMTokenCallback = (token: string) => Promise<void>

export function useUpdateFCMTokenCallback(): UpdateFCMTokenCallback {
	const [updateUserFCMToken] = useMutation(UPDATE_USER_FCM_TOKEN)
	return useCallback(
		async (fcmToken) => {
			await updateUserFCMToken({ variables: { body: { fcmToken } } })
		},
		[updateUserFCMToken]
	)
}

const UPDATE_USER_FCM_TOKEN = gql`
	mutation updateUserFCMToken($body: UserFCMInput!) {
		updateUserFCMToken(body: $body) {
			message
			status
		}
	}
`
