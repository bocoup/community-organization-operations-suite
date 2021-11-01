/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TagUsageCount } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { ContactCollection } from '~db/ContactCollection'
import { Interactor } from '~types'

@singleton()
export class ResolveTagUsageCountClientsInteractor
	implements Interactor<TagUsageCount, unknown, number>
{
	public constructor(private contacts: ContactCollection) {}

	public async execute(_: TagUsageCount) {
		const tag_id = (_ as any).tag_id
		const org_id = (_ as any).org_id
		return this.contacts.countWithTagsInOrg(org_id, tag_id)
	}
}
