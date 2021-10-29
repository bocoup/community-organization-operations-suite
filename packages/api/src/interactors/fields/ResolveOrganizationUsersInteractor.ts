/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Organization, User } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { UserCollection } from '~db/UserCollection'
import { createGQLUser } from '~dto'
import { Interactor } from '~types'
import { empty } from '~utils/noop'

@singleton()
export class ResolveOrganizationUsersInteractor
	implements Interactor<Organization, unknown, User[]>
{
	public constructor(private users: UserCollection) {}

	public async execute(_: Organization) {
		const result = await this.users.findUsersWithOrganization(_.id)
		const orgUsers = result.items ?? empty
		return orgUsers.map((u) => createGQLUser(u, true))
	}
}
