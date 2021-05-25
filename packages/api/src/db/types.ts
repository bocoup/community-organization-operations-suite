/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RoleType } from '@greenlight/schema/lib/provider-types'

export interface DbIdentified {
	id: string
}
export interface DbPaginationArgs {
	offset: number
	limit: number
}

export interface DbItemListResponse<T> {
	/**
	 * The items from this query
	 */
	items: T[]

	/**
	 * Are more items available?
	 */
	more?: boolean
	/**
	 * The number of items in the collection that match the given query.
	 */
	totalCount: number
}

export interface DbItemResponse<T> {
	item: T | null
}

export interface DbUser {
	id: string
	first_name: string
	middle_name: string
	last_name: string
	password: string
	email: string
	roles: DbRole[]
}

export interface DbUserToken {
	id: string
	user: string
	expiration: number
	creation: number
}

export interface DbRole {
	org_id: string
	role_type: RoleType
}

export interface DbAction {
	comment: string
	user_id: string
	date: string
}

export interface DbContact {
	id: string
	org_id: string
	first_name: string
	middle_name: string
	last_name: string
}

export enum EngagementStatus {
	NotStarted = 'NOT_STARTED',
	Open = 'OPEN',
	Closed = 'CLOSED',
	Pending = 'PENDING',
	Assigned = 'ASSIGNED',
	InProgress = 'IN_PROGRESS',
}

export interface DbEngagement {
	id: string
	org_id: string
	user_id?: string
	contact_id: string
	start_date: string
	end_date?: string
	description: string
	actions: DbAction[]
	status: EngagementStatus
}

export interface DbOrganization {
	id: string
	description: string
	name: string
	users: string[]
}
