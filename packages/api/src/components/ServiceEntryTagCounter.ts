/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { singleton } from 'tsyringe'
import { ServiceAnswerCollection } from '~db/ServiceAnswerCollection'
import { ServiceCollection } from '~db/ServiceCollection'

@singleton()
export class ServiceEntryTagCounter {
	public constructor(
		private services: ServiceCollection,
		private serviceAnswers: ServiceAnswerCollection
	) {}

	public async count(orgId: string, tagId: string) {
		// this is nasty, we should store answers in a new collection
		const { items: result } = await this.services.items(
			{},
			{ org_id: { $eq: orgId }, tags: { $eq: tagId } }
		)
		let total = 0
		for (const service of result) {
			total += await this.serviceAnswers.count({
				service_id: { $eq: service.id }
			})
		}
		return total
	}
}
