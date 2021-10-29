/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrgAuthDirectiveArgs, RoleType } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Authenticator } from '../Authenticator'
import { RequestContext, OrgAuthEvaluationStrategy } from '~types'
import { ServiceCollection } from '~db/ServiceCollection'
import { BaseOrgAuthEvaluationStrategy } from './BaseOrgAuthEvaluationStrategy'

const SERVICE_ANSWER_INPUT_ARG = 'serviceAnswer'

@singleton()
export class InputServiceAnswerEntityToOrgIdStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public constructor(authenticator: Authenticator, private services: ServiceCollection) {
		super(authenticator)
	}
	public name = 'InputServiceAnswerToOrgId'
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return resolverArgs[SERVICE_ANSWER_INPUT_ARG] != null
	}
	public async isAuthorized(
		_src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: RequestContext
	): Promise<boolean> {
		const answer = resolverArgs[SERVICE_ANSWER_INPUT_ARG]
		const { item: service } = await this.services.itemById(answer.serviceId)
		return this.authenticator.isAuthorized(
			ctx.identity,
			service?.org_id,
			directiveArgs.requires ?? RoleType.User
		)
	}
}
