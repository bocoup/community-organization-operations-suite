/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, ServiceAnswer } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { ContactCollection } from '~db/ContactCollection'
import { createGQLContact } from '~dto'
import { Interactor } from '~types'

@singleton()
export class ResolveServiceAnswerContactsInteractor
	implements Interactor<ServiceAnswer, unknown, Contact[]>
{
	public constructor(private contacts: ContactCollection) {}

	public async execute(_: ServiceAnswer) {
		const contactIds = _.contacts as any[] as string[]
		return Promise.all(
			contactIds.map(async (contactId) => {
				const contact = await this.contacts.itemById(contactId)
				if (!contact.item) {
					throw new Error(`Contact ${contactId} not found`)
				}
				return createGQLContact(contact.item)
			})
		)
	}
}
