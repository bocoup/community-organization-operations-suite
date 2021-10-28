/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationUpdateUserFcmTokenArgs } from '@cbosuite/schema/dist/client-types'
import { useCallback } from 'react'

export type UpdateFCMTokenCallback = (token: string) => Promise<void>

export function useUpdateFCMTokenCallback(): UpdateFCMTokenCallback {
	const [updateUserFCMToken] = useMutation<any, MutationUpdateUserFcmTokenArgs>(
		UPDATE_USER_FCM_TOKEN
	)
	return useCallback(
		async (fcmToken: string) => {
			await updateUserFCMToken({ variables: { fcmToken } })
		},
		[updateUserFCMToken]
	)
}

const UPDATE_USER_FCM_TOKEN = gql`
	mutation updateUserFCMToken($fcmToken: String!) {
		updateUserFCMToken(fcmToken: $fcmToken) {
			message
		}
	}
`
