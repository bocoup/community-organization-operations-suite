/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrgAuthDirectiveArgs, RoleType } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Authenticator } from '~components/Authenticator'
import { RequestContext, OrgAuthEvaluationStrategy } from '~types'

const ORG_ID_ARG = 'orgId'

@singleton()
export class OrgIdArgumentStrategy implements OrgAuthEvaluationStrategy {
	public name = 'OrgIdArgument'

	public constructor(private authenticator: Authenticator) {}

	public isApplicable(src: any, resolverArgs: any): boolean {
		return resolverArgs[ORG_ID_ARG] != null
	}
	public async isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: RequestContext
	): Promise<boolean> {
		const orgIdArg = resolverArgs[ORG_ID_ARG]
		return this.authenticator.isAuthorized(
			ctx.identity,
			orgIdArg,
			directiveArgs.requires ?? RoleType.User
		)
	}
}
