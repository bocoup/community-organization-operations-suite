/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrgAuthDirectiveArgs, RoleType } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Authenticator } from './Authenticator'
import {
	ContactCollection,
	EngagementCollection,
	ServiceAnswerCollection,
	ServiceCollection,
	TagCollection,
	UserCollection
} from '~db'
import { ORGANIZATION_TYPE } from '~dto'
import { AppContext, OrgAuthEvaluationStrategy } from '~types'
import { empty } from '~utils/noop'

abstract class BaseOrgAuthEvaluationStrategy {
	public constructor(protected authenticator: Authenticator) {}
}

const ORG_ID_ARG = 'orgId'
const SERVICE_ID_ARG = 'serviceId'
const ENGAGEMENT_ID_ARG = 'engagementId'
const CONTACT_ID_ARG = 'contactId'
const TAG_ID_ARG = 'tagId'
const ANSWER_ID_ARG = 'answerId'
const USER_ID_ARG = 'userId'

export class OrganizationSrcStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public name = 'OrganizationSrc'
	public isApplicable(src: any): boolean {
		return src?.__typename === ORGANIZATION_TYPE
	}
	public async isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: AppContext
	): Promise<boolean> {
		return this.authenticator.isAuthorized(
			ctx.requestCtx.identity,
			src.id,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

@singleton()
export class OrgIdArgStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public name = 'OrgIdArgument'
	public isApplicable(src: any, resolverArgs: any): boolean {
		return resolverArgs[ORG_ID_ARG] != null
	}
	public async isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: AppContext
	): Promise<boolean> {
		const orgIdArg = resolverArgs[ORG_ID_ARG]
		return this.authenticator.isAuthorized(
			ctx.requestCtx.identity,
			orgIdArg,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

@singleton()
export class EntityIdToOrgIdStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public constructor(
		authenticator: Authenticator,
		private readonly engagements: EngagementCollection,
		private readonly contacts: ContactCollection,
		private readonly tags: TagCollection,
		private readonly serviceAnswers: ServiceAnswerCollection,
		private readonly services: ServiceCollection
	) {
		super(authenticator)
	}
	public name = 'EntityIdToOrgId'
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return (
			resolverArgs[SERVICE_ID_ARG] != null ||
			resolverArgs[ENGAGEMENT_ID_ARG] != null ||
			resolverArgs[CONTACT_ID_ARG] != null ||
			resolverArgs[TAG_ID_ARG] != null ||
			resolverArgs[ANSWER_ID_ARG] != null
		)
	}
	public async isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		{ requestCtx }: AppContext
	): Promise<boolean> {
		let entity: { org_id: string } | null | undefined
		if (resolverArgs[SERVICE_ID_ARG] != null) {
			const { item } = await this.services.itemById(resolverArgs[SERVICE_ID_ARG])
			entity = item
		} else if (resolverArgs[ENGAGEMENT_ID_ARG] != null) {
			const { item } = await this.engagements.itemById(resolverArgs[ENGAGEMENT_ID_ARG])
			entity = item
		} else if (resolverArgs[CONTACT_ID_ARG] != null) {
			const { item } = await this.contacts.itemById(resolverArgs[CONTACT_ID_ARG])
			entity = item
		} else if (resolverArgs[TAG_ID_ARG] != null) {
			const { item } = await this.tags.itemById(resolverArgs[TAG_ID_ARG])
			entity = item
		} else if (resolverArgs[ANSWER_ID_ARG] != null) {
			const { item } = await this.serviceAnswers.itemById(resolverArgs[ANSWER_ID_ARG])
			if (item) {
				const { item: service } = await this.services.itemById(item.service_id)
				entity = service
			}
		}

		return this.authenticator.isAuthorized(
			requestCtx.identity,
			entity?.org_id,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

const ENGAGEMENT_INPUT_ARG = 'engagement'
const CONTACT_INPUT_ARG = 'contact'
const SERVICE_INPUT_ARG = 'service'
const TAG_INPUT_ARG = 'tag'
const SERVICE_ANSWER_INPUT_ARG = 'serviceAnswer'

@singleton()
export class InputEntityToOrgIdStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public name = 'InputEntityToOrgId'
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
		{ requestCtx }: AppContext
	): Promise<boolean> {
		const input =
			resolverArgs[ENGAGEMENT_INPUT_ARG] ||
			resolverArgs[CONTACT_INPUT_ARG] ||
			resolverArgs[SERVICE_INPUT_ARG] ||
			resolverArgs[TAG_INPUT_ARG]

		return this.authenticator.isAuthorized(
			requestCtx.identity,
			input?.orgId,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

@singleton()
export class InputServiceAnswerEntityToOrgIdStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public constructor(authenticator: Authenticator, private readonly services: ServiceCollection) {
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
		{ requestCtx }: AppContext
	): Promise<boolean> {
		const answer = resolverArgs[SERVICE_ANSWER_INPUT_ARG]
		const { item: service } = await this.services.itemById(answer.serviceId)
		return this.authenticator.isAuthorized(
			requestCtx.identity,
			service?.org_id,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

@singleton()
export class UserWithinOrgStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public constructor(authenticator: Authenticator, private readonly users: UserCollection) {
		super(authenticator)
	}
	public name = 'UserWithinOrg'
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return resolverArgs[USER_ID_ARG] != null
	}
	public async isAuthorized(
		_src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		{ requestCtx }: AppContext
	): Promise<boolean> {
		const userIdArg = resolverArgs[USER_ID_ARG]
		const { item: user } = await this.users.itemById(userIdArg)
		if (user) {
			const userOrgs = new Set<string>(user.roles.map((r) => r.org_id) ?? empty)
			for (const orgId of userOrgs) {
				// only admins can take actions on user entities in their org
				if (this.authenticator.isAuthorized(requestCtx.identity, orgId, RoleType.Admin)) {
					return true
				}
			}
		}
		return false
	}
}

@singleton()
export class OrgAuthStrategyListProvider {
	public constructor(
		private readonly orgSource: OrganizationSrcStrategy,
		private readonly orgIdArg: OrgIdArgStrategy,
		private readonly entityIdToOrgId: EntityIdToOrgIdStrategy,
		private readonly inputEntityToOrgId: InputEntityToOrgIdStrategy,
		private readonly inputServiceAnswerEntityToOrgId: InputServiceAnswerEntityToOrgIdStrategy,
		private readonly UserWithinOrgStrategy: UserWithinOrgStrategy
	) {}

	public get(): OrgAuthEvaluationStrategy[] {
		return [
			this.orgSource,
			this.orgIdArg,
			this.entityIdToOrgId,
			this.inputEntityToOrgId,
			this.inputServiceAnswerEntityToOrgId,
			this.UserWithinOrgStrategy
		]
	}
}
