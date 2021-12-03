/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { OrgAuthDirectiveArgs, RoleType } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Authenticator } from '~components/Authenticator'
import { RequestContext, OrgAuthEvaluationStrategy } from '~types'

const ENGAGEMENT_INPUT_ARG = 'engagement'
const CONTACT_INPUT_ARG = 'contact'
const SERVICE_INPUT_ARG = 'service'
const TAG_INPUT_ARG = 'tag'

@singleton()
export class InputEntityToOrgIdStrategy implements OrgAuthEvaluationStrategy {
	public name = 'InputEntityToOrgId'
	public constructor(private authenticator: Authenticator) {}
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return (
			resolverArgs[ENGAGEMENT_INPUT_ARG] != null ||
			resolverArgs[CONTACT_INPUT_ARG] != null ||
			resolverArgs[SERVICE_INPUT_ARG] != null ||
			resolverArgs[TAG_INPUT_ARG] != null
		)
	}
	public async isAuthorized(
		_src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: RequestContext
	): Promise<boolean> {
		const input =
			resolverArgs[ENGAGEMENT_INPUT_ARG] ||
			resolverArgs[CONTACT_INPUT_ARG] ||
			resolverArgs[SERVICE_INPUT_ARG] ||
			resolverArgs[TAG_INPUT_ARG]

		return this.authenticator.isAuthorized(
			ctx.identity,
			input?.orgId,
			directiveArgs.requires ?? RoleType.User
		)
	}
}
