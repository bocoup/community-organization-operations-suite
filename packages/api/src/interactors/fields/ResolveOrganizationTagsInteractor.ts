/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Tag, Organization } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { TagCollection } from '~db/TagCollection'
import { createGQLTag } from '~dto'
import { Interactor } from '~types'
import { empty } from '~utils/noop'

@singleton()
export class ResolveOrganizationTagsInteractor implements Interactor<Organization, unknown, Tag[]> {
	public constructor(private tags: TagCollection) {}

	public async execute(_: Organization) {
		const result = await this.tags.findTagsWithOrganization(_.id)
		const orgTags = result.items ?? empty
		return orgTags.map(createGQLTag)
	}
}
