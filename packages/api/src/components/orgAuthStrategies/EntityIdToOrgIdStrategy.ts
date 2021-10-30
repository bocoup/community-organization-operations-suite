/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OrgAuthDirectiveArgs, RoleType } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { Authenticator } from '../Authenticator'
import { RequestContext, OrgAuthEvaluationStrategy } from '~types'
import { EngagementCollection } from '~db/EngagementCollection'
import { ContactCollection } from '~db/ContactCollection'
import { TagCollection } from '~db/TagCollection'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { ServiceCollection } from '~db/ServiceCollection'

const SERVICE_ID_ARG = 'serviceId'
const ENGAGEMENT_ID_ARG = 'engagementId'
const CONTACT_ID_ARG = 'contactId'
const TAG_ID_ARG = 'tagId'
const ANSWER_ID_ARG = 'answerId'

@singleton()
export class EntityIdToOrgIdStrategy implements OrgAuthEvaluationStrategy {
	public name = 'EntityIdToOrgId'

	public constructor(
		private authenticator: Authenticator,
		private engagements: EngagementCollection,
		private contacts: ContactCollection,
		private tags: TagCollection,
		private serviceAnswers: ServiceAnswerCollection,
		private services: ServiceCollection
	) {}

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
		ctx: RequestContext
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
			ctx.identity,
			entity?.org_id,
			directiveArgs.requires ?? RoleType.User
		)
	}
}
