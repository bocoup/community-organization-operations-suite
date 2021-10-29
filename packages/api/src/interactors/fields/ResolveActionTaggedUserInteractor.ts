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
export class ResolveActionTaggedUserInteractor implements Interactor<Action, unknown, User | null> {
	public constructor(private users: UserCollection) {}

	public async execute(_: Action) {
		if (!_.taggedUser) return null

		const taggedUserId = _.taggedUser as any as string
		const taggedUser = await this.users.itemById(taggedUserId)

		if (!taggedUser.item) {
			throw new Error('user not found for action')
		}

		return createGQLUser(taggedUser.item, true)
	}
}
