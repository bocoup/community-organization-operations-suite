/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useResetRecoilState } from 'recoil'
import {
	currentUserState,
	organizationState,
	engagementListState,
	myEngagementListState,
	inactiveEngagementListState,
	hiddenReportFieldsState,
	selectedReportTypeState
} from '~store'
import { useCallback } from 'react'
import { useApolloClient } from '@apollo/client'

export type LogoutCallback = () => void

export function useLogoutCallback(): LogoutCallback {
	const resetOrg = useResetRecoilState(organizationState)
	const resetEngagement = useResetRecoilState(engagementListState)
	const resetMyEngagement = useResetRecoilState(myEngagementListState)
	const resetInactiveEngagement = useResetRecoilState(inactiveEngagementListState)
	const resetCurrentUser = useResetRecoilState(currentUserState)
	const resetHiddenFields = useResetRecoilState(hiddenReportFieldsState)
	const resetReportType = useResetRecoilState(selectedReportTypeState)
	const apolloClient = useApolloClient()

	return useCallback(() => {
		resetCurrentUser()
		resetOrg()
		resetEngagement()
		resetMyEngagement()
		resetInactiveEngagement()
		resetHiddenFields()
		resetReportType()
		apolloClient.clearStore() // Reset the Apollo cache entirely
	}, [
		resetEngagement,
		resetMyEngagement,
		resetInactiveEngagement,
		resetCurrentUser,
		resetOrg,
		resetHiddenFields,
		resetReportType,
		apolloClient
	])
}
