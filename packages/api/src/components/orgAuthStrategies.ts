/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrgAuthDirectiveArgs, RoleType } from '@cbosuite/schema/dist/provider-types'
import { Authenticator } from '~components'
import { ORGANIZATION_TYPE } from '~dto'
import { AppContext, OrgAuthEvaluationStrategy } from '~types'
import { empty } from '~utils/noop'

abstract class BaseOrgAuthEvaluationStrategy {
	public constructor(protected authenticator: Authenticator) {}
}

export class OrganizationSrcStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public isApplicable(src: any): boolean {
		return src.type === ORGANIZATION_TYPE
	}
	public async isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: AppContext
	): Promise<boolean> {
		return this.authenticator.isAuthorized(
			ctx.requestCtx.identity,
			src.orgId,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

export class OrgIdArgStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public isApplicable(src: any, resolverArgs: any): boolean {
		return resolverArgs['orgId'] != null
	}
	public async isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		ctx: AppContext
	): Promise<boolean> {
		const orgIdArg = resolverArgs['orgId']
		return this.authenticator.isAuthorized(
			ctx.requestCtx.identity,
			orgIdArg,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

export class EntityIdToOrgIdStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return (
			resolverArgs['serviceId'] != null ||
			resolverArgs['engagementId'] != null ||
			resolverArgs['contactId'] != null ||
			resolverArgs['answerId'] != null
		)
	}
	public async isAuthorized(
		src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		{
			collections: { services, engagements, contacts, tags, serviceAnswers },
			requestCtx
		}: AppContext
	): Promise<boolean> {
		let entity: { org_id: string } | null | undefined
		if (resolverArgs['serviceId'] != null) {
			const { item } = await services.itemById(resolverArgs['serviceId'])
			entity = item
		} else if (resolverArgs['engagementId'] != null) {
			const { item } = await engagements.itemById(resolverArgs['engagement'])
			entity = item
		} else if (resolverArgs['contactId'] != null) {
			const { item } = await contacts.itemById(resolverArgs['contactId'])
			entity = item
		} else if (resolverArgs['tagId'] != null) {
			const { item } = await tags.itemById(resolverArgs['tagId'])
			entity = item
		} else if (resolverArgs['answerId'] != null) {
			const { item } = await serviceAnswers.itemById(resolverArgs['answerId'])
			if (item) {
				const { item: service } = await services.itemById(item.service_id)
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

export class InputEntityToOrgIdStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return (
			resolverArgs['engagement'] != null ||
			resolverArgs['contact'] != null ||
			resolverArgs['service'] != null ||
			resolverArgs['tag'] != null
		)
	}
	public async isAuthorized(
		_src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		{ requestCtx, collections: { services } }: AppContext
	): Promise<boolean> {
		const input =
			resolverArgs['engagement'] ||
			resolverArgs['contact'] ||
			resolverArgs['service'] ||
			resolverArgs['tag']

		return this.authenticator.isAuthorized(
			requestCtx.identity,
			input?.orgId,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

export class InputServiceAnswerEntityToOrgIdStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return resolverArgs['serviceAnswer'] != null
	}
	public async isAuthorized(
		_src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		{ requestCtx, collections: { services } }: AppContext
	): Promise<boolean> {
		const answer = resolverArgs['serviceAnswer']
		const { item: service } = await services.itemById(answer.serviceId)
		return this.authenticator.isAuthorized(
			requestCtx.identity,
			service?.org_id,
			directiveArgs.requires ?? RoleType.User
		)
	}
}

export class UserWithinOrgStrategy
	extends BaseOrgAuthEvaluationStrategy
	implements OrgAuthEvaluationStrategy
{
	public isApplicable(_src: any, resolverArgs: any): boolean {
		return resolverArgs['userId'] != null
	}
	public async isAuthorized(
		_src: any,
		directiveArgs: OrgAuthDirectiveArgs,
		resolverArgs: any,
		{ requestCtx, collections: { users } }: AppContext
	): Promise<boolean> {
		const userIdArg = resolverArgs['userId']
		const { item: user } = await users.itemById(userIdArg)
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
