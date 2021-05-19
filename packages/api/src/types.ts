/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MercuriusContext } from 'mercurius'
import { RoleType } from '@greenlight/schema/lib/provider-types'

// TBD
export type User = any

export interface AuthArgs {
	/**
	 * The ID of the organization being authenticated into
	 */
	orgId: string

	requires: RoleType
}

export interface Context extends MercuriusContext {
	auth: {
		identity: User
	}
}

export interface HealthStatus {
	status: string
}
