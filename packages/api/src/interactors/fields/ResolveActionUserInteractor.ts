/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Action, User } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { UserCollection } from '~db/UserCollection'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'

@singleton()
export class ResolveActionUserInteractor implements Interactor<Action, unknown, User> {
	public constructor(private users: UserCollection) {}

	public async execute(_: Action) {
		const userId = _.user as any as string
		const user = await this.users.itemById(userId)
		if (!user.item) {
			throw new Error('user not found for action')
		}
		return createGQLUser(user.item, true)
	}
}
