/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { User } from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import { DismissMentionCallback, useDismissMentionCallback } from './useDismissMentionCallback'
import { UpdateFCMTokenCallback, useUpdateFCMTokenCallback } from './useUpdateFCMTokenCallback'
import { LoadUserCallback, useLoadCurrentUserCallback } from './useLoadCurrentUserCallback'
import { MarkMentionSeenCallback, useMarkMentionSeenCallback } from './useMarkMentionSeenCallback'
import { useCurrentRole, useIsAdmin, useMentionFilteredCurrentUser, useOrgId } from './stateHooks'
import { useMemo } from 'react'

export interface useCurrentUserReturn {
	currentUser: User
	userId: string
	role: string
	orgId: string
	loading: boolean
	error: any
	isAdmin: boolean
	load: LoadUserCallback
	markMentionSeen: MarkMentionSeenCallback
	dismissMention: DismissMentionCallback
	updateFCMToken: UpdateFCMTokenCallback
}

export function useCurrentUser(): useCurrentUserReturn {
	const [currentUser] = useRecoilState<User | null>(currentUserState)
	const orgId = useOrgId()
	const isAdmin = useIsAdmin(orgId)
	const currentRole = useCurrentRole(isAdmin)
	const filteredCurrentUser = useMentionFilteredCurrentUser()
	const markMentionSeen = useMarkMentionSeenCallback()
	const dismissMention = useDismissMentionCallback()
	const updateFCMToken = useUpdateFCMTokenCallback()
	const { load, loading, error } = useLoadCurrentUserCallback()

	return useMemo(
		() => ({
			// User loading
			load,
			loading,
			error,

			// Mentions
			markMentionSeen,
			dismissMention,

			// FCM Tokens
			updateFCMToken,

			// User State
			currentUser: filteredCurrentUser,
			userId: currentUser?.id,
			orgId: orgId || '',
			role: currentRole,
			isAdmin: isAdmin
		}),
		[
			currentUser,
			orgId,
			isAdmin,
			currentRole,
			filteredCurrentUser,
			markMentionSeen,
			dismissMention,
			updateFCMToken,
			load,
			loading,
			error
		]
	)
}
