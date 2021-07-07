/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RoleType } from '@greenlight/schema/lib/provider-types'
import { Configuration, Authenticator, Localization } from '~components'
import { DatabaseConnector } from '~components/DatabaseConnector'
import {
	ContactCollection,
	DbUser,
	OrganizationCollection,
	UserCollection,
	UserTokenCollection,
	EngagementCollection
} from '~db'
import { PubSub } from 'graphql-subscriptions'
import { Transporter } from 'nodemailer'

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
	pubsub: PubSub
	config: Configuration
	components: {
		mailer: Transporter
		authenticator: Authenticator
		dbConnector: DatabaseConnector
		localization: Localization
	}
	collections: {
		users: UserCollection
		orgs: OrganizationCollection
		contacts: ContactCollection
		userTokens: UserTokenCollection
		engagements: EngagementCollection
	}
}

export interface AppContext extends BuiltAppContext {
	auth: {
		identity: User | null
	}
}

export interface HealthStatus {
	status: string
}
