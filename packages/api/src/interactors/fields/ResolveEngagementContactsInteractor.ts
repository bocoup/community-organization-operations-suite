/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Contact, Engagement } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import type { ContactCollection } from '~db/ContactCollection'
import { createGQLContact } from '~dto'
import type { Interactor } from '~types'

@singleton()
export class ResolveEngagementContactsInteractor
	implements Interactor<Engagement, unknown, Contact[]>
{
	public constructor(private contacts: ContactCollection) {}

	public async execute(_: Engagement) {
		if (!_.contacts) return []

		const contactIds = _.contacts as any[] as string[]

		const result = await Promise.all([
			...contactIds.map(async (contactId) => {
				const contact = await this.contacts.itemById(contactId)
				if (!contact.item) {
					throw new Error('contact not found for engagement')
				}
				return createGQLContact(contact.item)
			})
		])

		return result
	}
}
