/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateNewTagArgs, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { TagCollection } from '~db'
import { createDBTag, createGQLTag } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessTagResponse } from '~utils/response'

export class CreateNewTagInteractor implements Interactor<MutationCreateNewTagArgs, TagResponse> {
	public constructor(
		private readonly localization: Localization,
		private readonly tags: TagCollection
	) {}

	public async execute(
		{ tag }: MutationCreateNewTagArgs,
		{ locale }: RequestContext
	): Promise<TagResponse> {
		const newTag = createDBTag(tag)

		try {
			await this.tags.insertItem(newTag)
		} catch (err) {
			throw err
		}

		return new SuccessTagResponse(
			this.localization.t('mutation.createNewTag.success', locale),
			createGQLTag(newTag)
		)
	}
}
