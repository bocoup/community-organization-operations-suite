/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createGQLName } from './createGQLName'
import { createGQLRole } from './createGQLRole'
import { createGQLMention } from './createGQLMention'
import type { User } from '@cbosuite/schema/dist/provider-types'
import { sortByCreatedAt } from '~utils'
import type { DbUser } from '~db'

export function createGQLUser(user: DbUser): User {
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
		roles: user.roles.map(createGQLRole),
		description: user.description,
		additionalInfo: user.additional_info,
		address: user.address,
		email: user.email,
		phone: user.phone,
		// EngagementCountsResolver hint
		engagementCounts: { user_id: user.id } as any,
		mentions: user.mentions?.map(createGQLMention)?.sort(sortByCreatedAt) || []
	}
}
