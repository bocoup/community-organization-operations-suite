/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContactInput, ContactResponse, StatusType } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ContactCollection, OrganizationCollection } from '~db'
import { createGQLContact } from '~dto'
import { createDBContact } from '~dto/createDBContact'
import { Interactor } from '~types'

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
			return {
				contact: null,
				message: this.#localization.t('mutation.createContact.orgIdRequired'),
				status: StatusType.Failed
			}
		}

		const newContact = createDBContact(contact)

		await Promise.all([
			this.#contacts.insertItem(newContact),
			this.#orgs.updateItem({ id: newContact.org_id }, { $push: { contacts: newContact.id } })
		])

		return {
			contact: createGQLContact(newContact),
			message: this.#localization.t('mutation.createContact.success'),
			status: StatusType.Success
		}
	}
}
