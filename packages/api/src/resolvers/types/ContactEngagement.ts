/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppContext } from '~types'
import {
	ContactEngagement as ContactEngagementType,
	ContactEngagementResolvers
} from '@resolve/schema/lib/provider-types'
import { createGQLUser } from '~dto'

export const ContactEngagement: ContactEngagementResolvers<AppContext> = {
	user: async (_: ContactEngagementType, args, context) => {
		if (!_.user) return null

		// if the user is already populated pass it along
		if (_.user.id) {
			return _.user
		}

		const userId = _.user as any as string
		const user = await context.collections.users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for engagement')
		}

		return createGQLUser(user.item)
	}
}
