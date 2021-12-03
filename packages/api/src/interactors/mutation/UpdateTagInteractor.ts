/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateTagArgs, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { createGQLTag } from '~dto'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'
import { SuccessTagResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { TagCollection } from '~db/TagCollection'
import { Telemetry } from '~components/Telemetry'
const logger = createLogger('interactors:update-tag')

@singleton()
export class UpdateTagInteractor
	implements Interactor<unknown, MutationUpdateTagArgs, TagResponse>
{
	public constructor(
		private localization: Localization,
		private tags: TagCollection,
		private telemetry: Telemetry
	) {
		this.localization = localization
		this.tags = tags
	}

	public async execute(
		_: unknown,
		{ tag }: MutationUpdateTagArgs,
		{ locale }: RequestContext
	): Promise<TagResponse> {
		if (!tag.id) {
			throw new UserInputError(this.localization.t('mutation.updateTag.tagIdRequired', locale))
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
			throw new Error(this.localization.t('mutation.updateTag.failed', locale))
		}

		// Get the updated tag from the database
		const { item: updatedTag } = await this.tags.itemById(tag.id)

		this.telemetry.trackEvent('UpdateTag')
		return new SuccessTagResponse(
			this.localization.t('mutation.updateTag.success', locale),
			createGQLTag(updatedTag!)
		)
	}
}
