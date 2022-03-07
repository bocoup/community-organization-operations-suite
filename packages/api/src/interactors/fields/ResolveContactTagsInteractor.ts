/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact, Tag } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import type { ContactCollection } from '~db/ContactCollection'
import type { TagCollection } from '~db/TagCollection'
import { createGQLTag } from '~dto'
import type { Interactor } from '~types'
import { empty } from '~utils/noop'

@singleton()
export class ResolveContactTagsInteractor implements Interactor<Contact, unknown, Tag[]> {
	public constructor(private contacts: ContactCollection, private tags: TagCollection) {}

	public async execute(_: Contact) {
		const contact = await this.contacts.itemById(_.id)

		// Get contact tags
		const dbTagResponse = await this.tags.items({}, { id: { $in: contact.item?.tags ?? [] } })
		return dbTagResponse.items?.map(createGQLTag) ?? empty
	}
}
