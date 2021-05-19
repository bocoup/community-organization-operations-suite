/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { MercuriusContext } from 'mercurius'
import { ContactCollection, OrganizationCollection, UserCollection } from '~db'

// TBD
export type User = any

export interface AuthArgs {
	/**
	 * The ID of the organization being authenticated into
	 */
	orgId: string

	requires: RoleType
}

export interface AppContext extends MercuriusContext {
	auth: {
		identity: User
	}
	collections: {
		users: UserCollection
		orgs: OrganizationCollection
		contacts: ContactCollection
	}
}

export interface HealthStatus {
	status: string
}
