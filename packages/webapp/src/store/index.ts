/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, selector } from 'recoil'
import type {
	AuthenticationResponse,
	Engagement,
	Organization,
	Contact,
	User
} from '@greenlight/schema/lib/client-types'
import { recoilPersist } from 'recoil-persist'

/**
 *
 * Settings for reoil
 *
 */
const { persistAtom } = recoilPersist()

// Atomic state for user auth
export const userAuthState = atom<AuthenticationResponse>({
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
export const organizationState = atom<Organization>({
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

// Atomic state for notifications panel
export const inAppNotificationsState = atom<{ message: string }[]>({
	key: 'inAppNotificationsState',
	default: [{ message: 'success' }]
})
