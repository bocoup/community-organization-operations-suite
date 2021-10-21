/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'
import type {
	Engagement,
	Organization,
	Contact,
	User,
	Service
} from '@cbosuite/schema/dist/client-types'
import { recoilPersist } from 'recoil-persist'
import { empty } from '~utils/noop'

/**
 *
 * Settings for reoil
 *
 */
const { persistAtom } = recoilPersist()

// Atomic state for user currentUser
export const currentUserState = atom<User | null>({
	key: 'currentUser',
	default: null,
	effects_UNSTABLE: [persistAtom]
})

// Atomic state for organization
export const organizationState = atom<Organization | null>({
	key: 'organization',
	default: null
})

// Atomic state for engagments
export const engagementListState = atom<Engagement[]>({
	key: 'engagementList',
	default: empty
})

// Atomic state for engagments
export const myEngagementListState = atom<Engagement[]>({
	key: 'myEngagementList',
	default: empty
})

// Atomic state for inactive engagments
export const inactiveEngagementListState = atom<Engagement[]>({
	key: 'inactiveEngagementList',
	default: empty
})

// Atomic state for contacts
export const contactListState = atom<Contact[]>({
	key: 'contactList',
	default: empty
})

// Atomic state for contacts
export const serviceListState = atom<Service[]>({
	key: 'serviceList',
	default: empty
})

// Atomic state for compliance warning modal
export const isComplianceWarningOpenState = atom<boolean>({
	key: 'isComplianceWarningOpen',
	default: true
})

export const collapsibleListsState = atom<Record<string, boolean>>({
	key: 'isMyRequestsListOpen',
	default: {
		isMyRequestsListOpen: true,
		isRequestsListOpen: false,
		isInactiveRequestsListOpen: false
	}
})

export const engagementState = atom<Engagement | null>({
	key: 'engagement',
	default: null
})
