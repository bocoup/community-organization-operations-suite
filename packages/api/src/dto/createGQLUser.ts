/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createGQLName } from './createGQLName'
import { createGQLRole } from './createGQLRole'
import { createGQLMention } from './createGQLMention'
import type { User } from '@resolve/schema/lib/provider-types'
import { sortByCreatedAt } from '~utils'
import type { DbUser } from '~db'

export function createGQLUser(
	user: DbUser,
	engagementCounts?: { active: number; closed: number }
): User {
	return {
		__typename: 'User',
		oid: user._id,
		id: user.id,
		name: createGQLName({
			first: user.first_name,
			middle: user.middle_name,
			last: user.last_name
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
					closed: engagementCounts.closed || 0
			  }
			: undefined,
		mentions: user.mentions?.map((m) => createGQLMention(m))?.sort(sortByCreatedAt) || []
	}
}
