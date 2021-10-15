/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { OrgTagInput, TagResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { OrganizationCollection, TagCollection } from '~db'
import { createDBTag, createGQLTag } from '~dto'
import { Interactor } from '~types'
import { FailedResponse, SuccessTagResponse } from '~utils/response'

export class CreateNewTagInteractor implements Interactor<OrgTagInput, TagResponse> {
	#localization: Localization
	#tags: TagCollection
	#orgs: OrganizationCollection

	public constructor(
		localization: Localization,
		tags: TagCollection,
		orgs: OrganizationCollection
	) {
		this.#localization = localization
		this.#tags = tags
		this.#orgs = orgs
	}

	public async execute(body: OrgTagInput): Promise<TagResponse> {
		const { orgId, tag } = body
		if (!orgId) {
			return new FailedResponse(this.#localization.t('mutation.createNewTag.orgIdRequired'))
		}
		const newTag = createDBTag(tag, orgId)

		try {
			await this.#tags.insertItem(newTag)
		} catch (err) {
			throw err
		}

		try {
			await this.#orgs.updateItem({ id: orgId }, { $push: { tags: newTag.id } })
		} catch (err) {
			throw err
		}

		return new SuccessTagResponse(
			this.#localization.t('mutation.createNewTag.success'),
			createGQLTag(newTag)
		)
	}
}
