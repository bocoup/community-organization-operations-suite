/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RoleType, User } from '@cbosuite/schema/dist/client-types'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { currentUserState, organizationState } from '~store'

export function useMentionFilteredCurrentUser(): User {
	const [currentUser] = useRecoilState<User | null>(currentUserState)
	return useMemo(
		() => ({
			...currentUser,
			mentions: currentUser?.mentions.filter((m) => !m.dismissed)
		}),
		[currentUser]
	)
}

// TODO: turn into recoil selector state
export function useIsAdmin(orgId: string): boolean {
	const currentUser = useRecoilValue<User | null>(currentUserState)
	return useMemo(() => {
		if (!currentUser) {
			return false
		}
		return currentUser.roles.some((r) => r.roleType === RoleType.Admin && r.orgId === orgId)
	}, [currentUser, orgId])
}

// TODO: turn into recoil selector state
export function useOrgId(): string {
	const currentUser = useRecoilValue<User | null>(currentUserState)
	const organization = useRecoilValue(organizationState)
	return useMemo(() => organization?.id ?? currentUser.roles[0].orgId, [currentUser, organization])
}

// TODO: turn into recoil selector state
export function useCurrentRole(isAdmin: boolean): RoleType {
	const [currentRole, setCurrentRole] = useState<RoleType>(RoleType.User)
	useEffect(() => {
		setCurrentRole(isAdmin ? RoleType.Admin : RoleType.User)
	}, [setCurrentRole, isAdmin])

	return currentRole
}
