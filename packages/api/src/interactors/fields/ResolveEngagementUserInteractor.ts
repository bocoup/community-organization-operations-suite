/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Engagement, User } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { UserCollection } from '~db/UserCollection'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'

@singleton()
export class ResolveEngagementUserInteractor
	implements Interactor<Engagement, unknown, User | null>
{
	public constructor(private users: UserCollection) {}

	public async execute(_: Engagement) {
		if (!_.user) return null

		// if the user is already populated pass it along
		if (_.user.id) {
			return _.user
		}

		const userId = _.user as any as string
		const user = await this.users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for engagement')
		}

		return createGQLUser(user.item, true)
	}
}
