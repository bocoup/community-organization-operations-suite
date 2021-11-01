/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrgAuthDirectiveArgs, RoleType } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Authenticator } from '../Authenticator'
import { RequestContext, OrgAuthEvaluationStrategy } from '~types'
import { empty } from '~utils/noop'
import { UserCollection } from '~db/UserCollection'

const USER_ID_ARG = 'userId'

@singleton()
export class UserWithinOrgStrategy implements OrgAuthEvaluationStrategy {
	public name = 'UserWithinOrg'

	public constructor(private authenticator: Authenticator, private users: UserCollection) {}

	public isApplicable(_src: any, resolverArgs: any): boolean {
		return resolverArgs[USER_ID_ARG] != null
	}
	public async isAuthorized(
		_src: any,
		_directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: RequestContext
	): Promise<boolean> {
		const userIdArg = resolverArgs[USER_ID_ARG]
		const { item: user } = await this.users.itemById(userIdArg)
		if (user) {
			const userOrgs = new Set<string>(user.roles.map((r) => r.org_id) ?? empty)
			for (const orgId of userOrgs) {
				// only admins can take actions on user entities in their org
				if (this.authenticator.isAuthorized(ctx.identity, orgId, RoleType.Admin)) {
					return true
				}
			}
		}
		return false
	}
}
