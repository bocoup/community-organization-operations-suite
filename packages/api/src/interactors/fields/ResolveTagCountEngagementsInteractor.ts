/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagUsageCount } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { EngagementCollection } from '~db/EngagementCollection'
import { Interactor } from '~types'

@singleton()
export class ResolveTagUsageCountEngagementsInteractor
	implements Interactor<TagUsageCount, unknown, number>
{
	public constructor(private engagements: EngagementCollection) {}

	public async execute(_: TagUsageCount) {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return this.engagements.countWithTagsInOrg(org_id, tag_id)
	}
}
