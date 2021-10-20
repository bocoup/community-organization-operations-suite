/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact, ContactIdInput } from '@cbosuite/schema/dist/provider-types'
import { ContactCollection } from '~db'
import { createGQLContact } from '~dto'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'

const logger = createLogger('getContactInteractor', true)

export class GetContactInteractor implements Interactor<ContactIdInput, Contact | null> {
	public constructor(private readonly contacts: ContactCollection) {}

	public async execute(
		{ contactId }: ContactIdInput,
		ctx: RequestContext
	): Promise<Contact | null> {
		const contactResponse = await this.contacts.itemById(contactId)

		if (!contactResponse.item) {
		}
		const contact = contactResponse.item
		if (!contact) {
			logger(`no contact found for ${contactId}`)
			return null
		} else if (contact.org_id !== ctx.orgId) {
			logger(`user not in contact org`)
			return null
		} else {
			return createGQLContact(contact)
		}
	}
}
