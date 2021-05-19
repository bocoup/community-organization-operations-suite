/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createGQLName } from './createGQLName'
import { createGQLRole } from './createGQLRole'
import type { User } from '@greenlight/schema/lib/provider-types'
import type { DbUser } from '~db'

export function createGQLUser(user: DbUser): User {
	return {
		__typename: 'User',
		id: user.id,
		name: createGQLName(user.first_name, user.middle_name, user.last_name),
		roles: user.roles.map((r) => createGQLRole(r)),
	}
}
