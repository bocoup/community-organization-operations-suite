/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ServiceAnswer, QueryServiceAnswersArgs } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { ServiceAnswerCollection, ServiceCollection } from '~db'
import { createGQLServiceAnswer } from '~dto/createGQLServiceAnswer'
import { Interactor, RequestContext } from '~types'
import { empty } from '~utils/noop'

@singleton()
export class GetServicesAnswersInteractor
	implements Interactor<QueryServiceAnswersArgs, ServiceAnswer[]>
{
	public constructor(
		private readonly services: ServiceCollection,
		private readonly serviceAnswers: ServiceAnswerCollection
	) {}

	public async execute({ serviceId, offset, limit }: QueryServiceAnswersArgs, ctx: RequestContext) {
		offset = offset ?? 0
		limit = limit ?? 250

		const { item: service } = await this.services.itemById(serviceId)
		if (!service) {
			return empty
		}

		// users outside of org should not see responses
		if (!ctx.identity?.roles.some((r) => r.org_id === service.org_id)) {
			return empty
		}
		const result = await this.serviceAnswers.items({ offset, limit }, { service_id: serviceId })
		return result.items.map(createGQLServiceAnswer)
	}
}
