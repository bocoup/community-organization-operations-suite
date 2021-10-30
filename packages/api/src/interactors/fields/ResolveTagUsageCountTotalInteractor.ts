/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagUsageCount } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { ServiceEntryTagCounter } from '~components/ServiceEntryTagCounter'
import { ContactCollection } from '~db/ContactCollection'
import { EngagementCollection } from '~db/EngagementCollection'
import { Interactor } from '~types'

@singleton()
export class ResolveTagUsageCountTotalInteractor
	implements Interactor<TagUsageCount, unknown, number>
{
	public constructor(
		private engagements: EngagementCollection,
		private contacts: ContactCollection,
		private serviceEntryTagCounter: ServiceEntryTagCounter
	) {}

	public async execute(_: TagUsageCount) {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		const counts = await Promise.all([
			this.serviceEntryTagCounter.count(org_id, tag_id),
			this.engagements.countWithTagsInOrg(org_id, tag_id),
			this.contacts.countWithTagsInOrg(org_id, tag_id)
		])
		return counts.reduce((acc, val) => acc + val, 0)
	}
}
