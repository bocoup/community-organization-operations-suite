/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useResetRecoilState } from 'recoil'
import {
	userAuthResponseState,
	currentUserState,
	organizationState,
	engagementListState,
	myEngagementListState,
	inactiveEngagementListState
} from '~store'
import { useCallback } from 'react'

export type LogoutCallback = () => void

export function useLogoutCallback(): LogoutCallback {
	const resetOrg = useResetRecoilState(organizationState)
	const resetEngagement = useResetRecoilState(engagementListState)
	const resetMyEngagement = useResetRecoilState(myEngagementListState)
	const resetInactiveEngagement = useResetRecoilState(inactiveEngagementListState)
	const resetUserAuth = useResetRecoilState(userAuthResponseState)
	const resetCurrentUser = useResetRecoilState(currentUserState)

	return useCallback(() => {
		resetUserAuth()
		resetCurrentUser()
		resetOrg()
		resetEngagement()
		resetMyEngagement()
		resetInactiveEngagement()
	}, [
		resetUserAuth,
		resetEngagement,
		resetMyEngagement,
		resetInactiveEngagement,
		resetCurrentUser,
		resetOrg
	])
}
