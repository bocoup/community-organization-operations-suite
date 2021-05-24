/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MercuriusContext } from 'mercurius'
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { Configuration, Authenticator } from '~components'
import { DatabaseConnector } from '~components/DatabaseConnector'
import {
	ContactCollection,
	DbUser,
	OrganizationCollection,
	UserCollection,
	UserTokenCollection,
	EngagementCollection,
} from '~db'

export interface Provider<T> {
	get(): T
}
export interface AsyncProvider<T> {
	get(): Promise<T>
}

export type User = DbUser

export interface AuthArgs {
	/**
	 * The ID of the organization being authenticated into
	 */
	orgId: string

	requires: RoleType
}

export interface BuiltAppContext {
	config: Configuration
	components: {
		authenticator: Authenticator
		dbConnector: DatabaseConnector
	}
	collections: {
		users: UserCollection
		orgs: OrganizationCollection
		contacts: ContactCollection
		userTokens: UserTokenCollection
		engagements: EngagementCollection
	}
}

export interface AppContext extends BuiltAppContext, MercuriusContext {
	auth: {
		identity: User | null
	}
}

export interface HealthStatus {
	status: string
}
