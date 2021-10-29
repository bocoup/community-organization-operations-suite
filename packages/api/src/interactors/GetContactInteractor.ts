/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Contact, QueryContactArgs } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { ContactCollection } from '~db/ContactCollection'
import { createGQLContact } from '~dto'
import { Interactor, RequestContext } from '~types'
import { createLogger } from '~utils'

const logger = createLogger('getContactInteractor', true)

@singleton()
export class GetContactInteractor implements Interactor<QueryContactArgs, Contact | null> {
	public constructor(private contacts: ContactCollection) {}

	public async execute(
		{ contactId }: QueryContactArgs,
		ctx: RequestContext
	): Promise<Contact | null> {
		const contactResponse = await this.contacts.itemById(contactId)

		if (!contactResponse.item) {
		}
		const contact = contactResponse.item
		if (!contact) {
			logger(`no contact found for ${contactId}`)
			return null
		} else if (!ctx.identity?.roles.some((r) => r.org_id === contact.org_id)) {
			logger(`user not in contact org`)
			return null
		} else {
			return createGQLContact(contact)
		}
	}
}
