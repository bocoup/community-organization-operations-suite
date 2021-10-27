/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateTagArgs, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { TagCollection } from '~db'
import { createGQLTag } from '~dto'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'
import { FailedResponse, SuccessTagResponse } from '~utils/response'
const logger = createLogger('interactors:update-tag')

export class UpdateTagInteractor implements Interactor<MutationUpdateTagArgs, TagResponse> {
	public constructor(
		private readonly localization: Localization,
		private readonly tags: TagCollection
	) {
		this.localization = localization
		this.tags = tags
	}

	public async execute(
		{ tag }: MutationUpdateTagArgs,
		{ locale }: RequestContext
	): Promise<TagResponse> {
		if (!tag.id) {
			return new FailedResponse(this.localization.t('mutation.updateTag.tagIdRequired', locale))
		}

		// Update the tag
		try {
			await this.tags.updateItem(
				{ id: tag.id },
				{
					$set: {
						label: tag.label || undefined,
						description: tag.description || undefined,
						category: tag.category || undefined
					}
				}
			)
		} catch (error) {
			logger('failed to update tag', error)
			return new FailedResponse(this.localization.t('mutation.updateTag.failed', locale))
		}

		// Get the updated tag from the database
		const { item: updatedTag } = await this.tags.itemById(tag.id)

		return new SuccessTagResponse(
			this.localization.t('mutation.updateTag.success', locale),
			createGQLTag(updatedTag!)
		)
	}
}
