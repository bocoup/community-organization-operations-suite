/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { User } from '@cbosuite/schema/dist/client-types'
import { useRecoilState } from 'recoil'
import { currentUserState } from '~store'
import type { DismissMentionCallback } from './useDismissMentionCallback'
import { useDismissMentionCallback } from './useDismissMentionCallback'
import type { UpdateFCMTokenCallback } from './useUpdateFCMTokenCallback'
import { useUpdateFCMTokenCallback } from './useUpdateFCMTokenCallback'
import type { LoadUserCallback } from './useLoadCurrentUserCallback'
import { useLoadCurrentUserCallback } from './useLoadCurrentUserCallback'
import type { MarkMentionSeenCallback } from './useMarkMentionSeenCallback'
import { useMarkMentionSeenCallback } from './useMarkMentionSeenCallback'
import type { UpdateUserPreferencesCallback } from './useUpdateUserPreferences'
import { useUpdateUserPreferences } from './useUpdateUserPreferences'
import { useCurrentRole, useIsAdmin, useMentionFilteredCurrentUser, useOrgId } from './stateHooks'
import { useMemo } from 'react'

export interface useCurrentUserReturn {
	currentUser: User
	setCurrentUser: (user: User) => void
	userId: string
	role: string
	orgId: string
	loading: boolean
	error: any
	isAdmin: boolean
	preferences: string
	load: LoadUserCallback
	markMentionSeen: MarkMentionSeenCallback
	dismissMention: DismissMentionCallback
	updateFCMToken: UpdateFCMTokenCallback
	updateUserPreferences: UpdateUserPreferencesCallback
}

export function useCurrentUser(): useCurrentUserReturn {
	const [currentUser, setCurrentUser] = useRecoilState<User | null>(currentUserState)
	const orgId = useOrgId()
	const isAdmin = useIsAdmin(orgId)
	const currentRole = useCurrentRole(isAdmin)
	const filteredCurrentUser = useMentionFilteredCurrentUser()
	const markMentionSeen = useMarkMentionSeenCallback()
	const dismissMention = useDismissMentionCallback()
	const updateFCMToken = useUpdateFCMTokenCallback()
	const updateUserPreferences = useUpdateUserPreferences()
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
			setCurrentUser,
			updateUserPreferences,
			userId: currentUser?.id,
			orgId: orgId || '',
			role: currentRole,
			isAdmin: isAdmin,
			preferences: currentUser?.preferences || ''
		}),
		[
			currentUser,
			setCurrentUser,
			orgId,
			isAdmin,
			currentRole,
			filteredCurrentUser,
			markMentionSeen,
			dismissMention,
			updateFCMToken,
			updateUserPreferences,
			load,
			loading,
			error
		]
	)
}
