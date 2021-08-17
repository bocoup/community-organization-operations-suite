/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, selector } from 'recoil'
import type { Engagement, Organization, Contact, User } from '@cbosuite/schema/lib/client-types'
import { recoilPersist } from 'recoil-persist'
import { AuthResponse } from '~hooks/api'

/**
 *
 * Settings for reoil
 *
 */
const { persistAtom } = recoilPersist()

// Atomic state for user auth
export const userAuthState = atom<AuthResponse | null>({
	key: 'userAuthState',
	default: null,
	effects_UNSTABLE: [persistAtom]
})

// Atomic state for user currentUser
export const currentUserState = atom<User | null>({
	key: 'currentUserState',
	default: null,
	effects_UNSTABLE: [persistAtom]
})

// Atomic state for organization
export const organizationState = atom<Organization | null>({
	key: 'organizationState',
	default: null,
	effects_UNSTABLE: [persistAtom]
})

export const GetOrg = selector({
	key: 'getOrg',
	get: ({ get }) => get(organizationState)
})

// Atomic state for engagments
export const engagementListState = atom<Engagement[]>({
	key: 'engagementListState',
	default: [],
	effects_UNSTABLE: [persistAtom]
})

// Atomic state for engagments
export const myEngagementListState = atom<Engagement[]>({
	key: 'myEngagementListState',
	default: [],
	effects_UNSTABLE: [persistAtom]
})

// Atomic state for inactive engagments
export const inactiveEngagementListState = atom<Engagement[]>({
	key: 'inactiveEngagementListState',
	default: [],
	effects_UNSTABLE: [persistAtom]
})

// Atomic state for contacts
export const contactListState = atom<Contact[]>({
	key: 'contactListState',
	default: [],
	effects_UNSTABLE: [persistAtom]
})

// Atomic state for notifications panel
export const isNotificationsPanelOpenState = atom<boolean>({
	key: 'isNotificationsPanelOpenState',
	default: false
})

// Atomic state for compliance warning modal
export const isComplianceWarningOpenState = atom<boolean>({
	key: 'isComplianceWarningOpenState',
	default: true
})

export const collapsibleListsState = atom<Record<string, boolean>>({
	key: 'isMyRequestsListOpenState',
	default: {
		isMyRequestsListOpen: true,
		isRequestsListOpen: false,
		isInactiveRequestsListOpen: false
	}
})

export const engagementState = atom<Engagement | null>({
	key: 'engagementState',
	default: null,
	effects_UNSTABLE: [persistAtom]
})
