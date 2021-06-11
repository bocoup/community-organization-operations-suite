/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createGQLName } from './createGQLName'
import { createGQLRole } from './createGQLRole'
import type {
	EngagementCounts,
	User,
} from '@greenlight/schema/lib/provider-types'
import type { DbUser } from '~db'

export function createGQLUser(
	user: DbUser,
	engagementCounts?: { active: number; closed: number }
): User {
	return {
		__typename: 'User',
		id: user.id,
		name: createGQLName({
			first: user.first_name,
			middle: user.middle_name,
			last: user.last_name,
		}),
		userName: user.user_name,
		roles: user.roles.map((r) => createGQLRole(r)),
		description: user.description,
		additionalInfo: user.additional_info,
		address: user.address,
		email: user.email,
		phone: user.phone,
		engagementCounts: engagementCounts
			? {
					active: engagementCounts.active || 0,
					closed: engagementCounts.closed || 0,
			  }
			: undefined,
	}
}
