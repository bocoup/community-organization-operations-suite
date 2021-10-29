/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Mention, User } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { UserCollection } from '~db/UserCollection'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'

@singleton()
export class ResolveMentionCreatedByInteractor
	implements Interactor<Mention, unknown, User | null>
{
	public constructor(private users: UserCollection) {}

	public async execute(_: Mention) {
		if (!_.createdBy) return null

		if (_.createdBy.id) {
			return _.createdBy
		}

		const userId = _.createdBy as any as string
		const user = await this.users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for notification')
		}

		return createGQLUser(user.item, true)
	}
}
