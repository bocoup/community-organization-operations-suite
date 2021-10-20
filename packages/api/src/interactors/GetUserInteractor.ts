/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { User, UserIdInput } from '@cbosuite/schema/dist/provider-types'
import { UserCollection } from '~db'
import { createGQLUser } from '~dto'
import { Interactor, RequestContext } from '~types'

export class GetUserInteractor implements Interactor<UserIdInput, User | null> {
	public constructor(private readonly users: UserCollection) {}

	public async execute({ userId }: UserIdInput, ctx: RequestContext): Promise<User | null> {
		const result = await this.users.itemById(userId)
		if (!result.item) {
			return null
		}
		const isSelf = ctx.identity?.id === userId
		const userOrgs = new Set<string>(result.item.roles.map((r) => r.org_id))
		const isInSameOrg = ctx.orgId ? userOrgs.has(ctx.orgId) : false

		return createGQLUser(result.item, isSelf || isInSameOrg)
	}
}
