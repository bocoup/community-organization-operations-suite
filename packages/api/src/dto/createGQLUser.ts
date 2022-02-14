/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { createGQLName } from './createGQLName'
import { createGQLRole } from './createGQLRole'
import { createGQLMention } from './createGQLMention'
import { User } from '@cbosuite/schema/dist/provider-types'
import { sortByCreatedAt } from '~utils'
import { DbUser } from '~db/types'
import { empty } from '~utils/noop'

const USER_TYPE = 'User'

export function createGQLUser(user: DbUser, sharePersonalInfo: boolean): User {
	return {
		__typename: USER_TYPE,
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
		// EngagementCountsResolver hint
		engagementCounts: { user_id: user.id } as any,
		mentions: user.mentions?.map(createGQLMention)?.sort(sortByCreatedAt) || empty,

		// Personal Information
		address: sharePersonalInfo ? user.address : null,
		email: sharePersonalInfo ? user.email : null,
		phone: sharePersonalInfo ? user.phone : null,

		preferences: user.preferences
	}
}
