/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContactInput, ContactResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ContactCollection, OrganizationCollection } from '~db'
import { createGQLContact } from '~dto'
import { createDBContact } from '~dto/createDBContact'
import { Interactor } from '~types'
import { FailedResponse, SuccessContactResponse } from '~utils/response'

export class CreateContactInteractor implements Interactor<ContactInput, ContactResponse> {
	#localization: Localization
	#contacts: ContactCollection
	#orgs: OrganizationCollection

	public constructor(
		localization: Localization,
		contacts: ContactCollection,
		orgs: OrganizationCollection
	) {
		this.#localization = localization
		this.#contacts = contacts
		this.#orgs = orgs
	}

	public async execute(contact: ContactInput): Promise<ContactResponse> {
		if (!contact.orgId) {
			return new FailedResponse(this.#localization.t('mutation.createContact.orgIdRequired'))
		}

		const newContact = createDBContact(contact)

		await Promise.all([
			this.#contacts.insertItem(newContact),
			this.#orgs.updateItem({ id: newContact.org_id }, { $push: { contacts: newContact.id } })
		])

		return new SuccessContactResponse(
			this.#localization.t('mutation.createContact.success'),
			createGQLContact(newContact)
		)
	}
}
