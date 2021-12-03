/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { gql, useMutation } from '@apollo/client'
import { MutationInitiatePasswordResetArgs, VoidResponse } from '@cbosuite/schema/dist/client-types'
import { MessageResponse } from '../types'
import { useCallback } from 'react'
import { handleGraphqlResponse } from '~utils/handleGraphqlResponse'

const INITIATE_PASSWORD_RESET = gql`
	mutation initiatePasswordReset($email: String!) {
		initiatePasswordReset(email: $email) {
			message
		}
	}
`

export type InitiatePasswordResetCallback = (email: string) => Promise<MessageResponse>

export function useInitiatePasswordResetCallback(): InitiatePasswordResetCallback {
	const [initiatePasswordReset] = useMutation<any, MutationInitiatePasswordResetArgs>(
		INITIATE_PASSWORD_RESET
	)
	return useCallback(
		async (email: string) => {
			return handleGraphqlResponse(initiatePasswordReset({ variables: { email } }), {
				onSuccess: ({ initiatePasswordReset }: { initiatePasswordReset: VoidResponse }) =>
					initiatePasswordReset.message
			})
		},
		[initiatePasswordReset]
	)
}
