/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { User, QueryUserArgs } from '@cbosuite/schema/dist/provider-types'
import { UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'
import { empty } from '~utils/noop'

export class GetUserInteractor implements Interactor<QueryUserArgs, User | null> {
	public constructor(private readonly users: UserCollection) {}

	public async execute({ userId }: QueryUserArgs, ctx: RequestContext): Promise<User | null> {
		const result = await this.users.itemById(userId)
		if (!result.item) {
			return null
		}
		const isSelf = ctx.identity?.id === userId
		const userOrgs = new Set<string>(ctx.identity?.roles.map((r) => r.org_id) ?? empty)
		const isInSameOrg = result.item.roles.some((r) => userOrgs.has(r.org_id))

		return createGQLUser(result.item, isSelf || isInSameOrg)
	}
}
