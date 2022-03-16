/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateNewTagArgs, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { ForbiddenError } from 'apollo-server-errors'
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
		{ locale, identity }: RequestContext
	): Promise<TagResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
		const newTag = createDBTag(tag, identity.id)

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
