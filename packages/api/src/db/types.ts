/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	RoleType,
	EngagementStatus,
	ServiceStatus,
	ContactStatus,
	ServiceFieldType,
	ServiceFieldRequirement
} from '@cbosuite/schema/dist/provider-types'

export interface DbIdentified {
	id: string
}
export interface DbPaginationArgs {
	offset?: number
	limit?: number
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
	_id?: string
	id: string
	first_name: string
	middle_name: string
	last_name: string
	user_name: string
	password: string
	email: string
	roles: DbRole[]
	description?: string
	additional_info?: string
	address?: DbAddress
	phone?: string
	mentions?: DbMention[]
	forgot_password_token?: string
	fcm_token?: string | null
	preferences?: string
}

export interface DbMention {
	engagement_id: string
	created_at: string
	created_by: string
	message?: string
	seen: boolean
	dismissed: boolean
}

export interface DbRole {
	org_id: string
	role_type: RoleType
}

export interface DbAction {
	comment: string
	user_id: string
	org_id: string
	date: string
	tagged_user_id?: string
	tags?: string[]
}

export interface DbAddress {
	street: string
	unit?: string
	city?: string
	county?: string
	state?: string
	zip: string
}

export interface DbContact {
	id: string
	org_id: string
	first_name: string
	middle_name?: string
	last_name: string
	phone?: string
	email?: string
	address?: DbAddress
	date_of_birth?: string
	tags?: string[]
	status?: ContactStatus
	demographics: DbContactDemographics
	notes?: string
}

export interface DbContactDemographics {
	gender: string
	gender_other: string
	ethnicity: string
	ethnicity_other: string
	race: string
	race_other: string
	preferred_language: string
	preferred_language_other: string
	preferred_contact_method: string
	preferred_contact_time: string
}

export interface DbEngagement {
	id: string
	org_id: string
	user_id?: string
	contacts: string[]
	start_date: string
	end_date?: string
	title: string
	description: string
	actions: DbAction[]
	status: EngagementStatus
	tags: string[]
}

export interface DbOrganization {
	id: string
	description: string
	name: string
	users: string[]
	contacts: string[]
	tags: string[]
}

export interface DbTag {
	id: string
	label: string
	description?: string
	org_id: string
	category?: string
}

export interface DbServiceFieldInput {
	id: string
	label: string
}

export interface DbServiceField {
	id: string
	name: string
	type: ServiceFieldType
	requirement: ServiceFieldRequirement
	inputs?: DbServiceFieldInput[]
}

export interface DbServiceAnswerField {
	field_id: string
	value: string | string[]
}

export interface DbServiceAnswer {
	id: string
	service_id: string
	contacts: string[]
	fields: Array<DbServiceAnswerField>
}

export interface DbService {
	id: string
	org_id: string
	name: string
	description?: string
	tags?: string[]
	fields?: DbServiceField[]
	status: ServiceStatus
	contactFormEnabled: boolean
}
