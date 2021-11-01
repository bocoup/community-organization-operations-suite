/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Contact, Organization } from '@cbosuite/schema/dist/provider-types'
import { singleton } from 'tsyringe'
import { ContactCollection } from '~db/ContactCollection'
import { createGQLContact } from '~dto'
import { Interactor } from '~types'
import { empty } from '~utils/noop'

@singleton()
export class ResolveOrganizationContactsInteractor
	implements Interactor<Organization, unknown, Contact[]>
{
	public constructor(private contacts: ContactCollection) {}

	public async execute(_: Organization) {
		const result = await this.contacts.findContactsWithOrganization(_.id)
		const orgContacts = result.items ?? empty
		return orgContacts
			.map(createGQLContact)
			.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	}
}
