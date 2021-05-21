/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { MercuriusContext } from 'mercurius'
import { Configuration, Authenticator } from '~components'
import {
	ContactCollection,
	OrganizationCollection,
	UserCollection,
	UserTokenCollection,
} from '~db'

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
	config: Configuration
	collections: {
		users: UserCollection
		orgs: OrganizationCollection
		contacts: ContactCollection
		userTokens: UserTokenCollection
	}
	authenticator: Authenticator
}

export interface HealthStatus {
	status: string
}
