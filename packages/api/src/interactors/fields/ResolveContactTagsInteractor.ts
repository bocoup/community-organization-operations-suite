/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, Tag } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { ContactCollection } from '~db/ContactCollection'
import { TagCollection } from '~db/TagCollection'
import { createGQLTag } from '~dto'
import { Interactor } from '~types'
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
