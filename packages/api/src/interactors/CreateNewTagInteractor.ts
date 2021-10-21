/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateNewTagArgs, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { OrganizationCollection, TagCollection } from '~db'
import { createDBTag, createGQLTag } from '~dto'
import { Interactor } from '~types'
import { SuccessTagResponse } from '~utils/response'

export class CreateNewTagInteractor implements Interactor<MutationCreateNewTagArgs, TagResponse> {
	public constructor(
		private readonly localization: Localization,
		private readonly tags: TagCollection,
		private readonly orgs: OrganizationCollection
	) {}

	public async execute({ tag }: MutationCreateNewTagArgs): Promise<TagResponse> {
		const newTag = createDBTag(tag)

		try {
			await this.tags.insertItem(newTag)
		} catch (err) {
			throw err
		}

		try {
			await this.orgs.updateItem({ id: newTag.org_id }, { $push: { tags: newTag.id } })
		} catch (err) {
			throw err
		}

		return new SuccessTagResponse(
			this.localization.t('mutation.createNewTag.success'),
			createGQLTag(newTag)
		)
	}
}
