/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { OrgTagInput, StatusType, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { TagCollection } from '~db'
import { createGQLTag } from '~dto'
import { Interactor } from '~types'

export class UpdateTagInteractor implements Interactor<OrgTagInput, TagResponse> {
	#localization: Localization
	#tags: TagCollection

	public constructor(localization: Localization, tags: TagCollection) {
		this.#localization = localization
		this.#tags = tags
	}

	public async execute(body: OrgTagInput): Promise<TagResponse> {
		const { tag } = body
		if (!tag.id) {
			return {
				tag: null,
				message: this.#localization.t('mutation.updateTag.tagIdRequired'),
				status: StatusType.Failed
			}
		}

		// Update the tag
		try {
			await this.#tags.updateItem(
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
			console.log('Failed to update tag', error)
		}

		// Get the updated tag from the database
		const { item: updatedTag } = await this.#tags.itemById(tag.id)

		return {
			tag: createGQLTag(updatedTag!),
			message: this.#localization.t('mutation.updateTag.success'),
			status: StatusType.Success
		}
	}
}
