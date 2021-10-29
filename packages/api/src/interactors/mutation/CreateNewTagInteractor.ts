/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateNewTagArgs, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { createDBTag, createGQLTag } from '~dto'
import { Interactor, RequestContext } from '~types'
import { SuccessTagResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { TagCollection } from '~db/TagCollection'
import { Telemetry } from '~components/Telemetry'

@singleton()
export class CreateNewTagInteractor
	implements Interactor<unknown, MutationCreateNewTagArgs, TagResponse>
{
	public constructor(
		private localization: Localization,
		private tags: TagCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
		{ tag }: MutationCreateNewTagArgs,
		{ locale }: RequestContext
	): Promise<TagResponse> {
		const newTag = createDBTag(tag)

		try {
			await this.tags.insertItem(newTag)
		} catch (err) {
			throw err
		}

		this.telemetry.trackEvent('CreateNewTag')
		return new SuccessTagResponse(
			this.localization.t('mutation.createNewTag.success', locale),
			createGQLTag(newTag)
		)
	}
}
