/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Attribute,
	ContactInput,
	ContactResponse,
	StatusType
} from '@cbosuite/schema/dist/provider-types'
import { Configuration, Localization } from '~components'
import { ContactCollection, DbContact, EngagementCollection, OrganizationCollection } from '~db'
import { createGQLContact, createGQLEngagement } from '~dto'
import { createGQLAttribute } from '~dto/createGQLAttribute'
import { Interactor } from '~types'

export class UpdateContactInteractor implements Interactor<ContactInput, ContactResponse> {
	#localization: Localization
	#config: Configuration
	#contacts: ContactCollection
	#engagements: EngagementCollection
	#orgs: OrganizationCollection

	public constructor(
		localization: Localization,
		config: Configuration,
		contacts: ContactCollection,
		engagements: EngagementCollection,
		orgs: OrganizationCollection
	) {
		this.#localization = localization
		this.#config = config
		this.#contacts = contacts
		this.#engagements = engagements
		this.#orgs = orgs
	}

	public async execute(contact: ContactInput): Promise<ContactResponse> {
		if (!contact.id) {
			return {
				contact: null,
				message: this.#localization.t('mutation.updateContact.contactIdRequired'),
				status: StatusType.Failed
			}
		}

		if (!contact.orgId) {
			return {
				contact: null,
				message: this.#localization.t('mutation.updateContact.orgIdRequired'),
				status: StatusType.Failed
			}
		}

		const result = await this.#contacts.itemById(contact.id)
		if (!result.item) {
			return {
				contact: null,
				message: this.#localization.t('mutation.updateContact.userNotFound'),
				status: StatusType.Failed
			}
		}
		const dbContact = result.item

		const changedData: DbContact = {
			...dbContact,
			first_name: contact.first,
			middle_name: contact.middle || undefined,
			last_name: contact.last,
			date_of_birth: contact.dateOfBirth || undefined,
			email: contact.email || undefined,
			phone: contact.phone || undefined,
			address: contact?.address
				? {
						street: contact.address?.street || '',
						unit: contact.address?.unit || '',
						city: contact.address?.city || '',
						state: contact.address?.state || '',
						zip: contact.address?.zip || ''
				  }
				: undefined,
			demographics: {
				gender: contact.demographics?.gender || '',
				ethnicity: contact.demographics?.ethnicity || '',
				race: contact.demographics?.race || '',
				preferred_contact_method: contact.demographics?.preferredContactMethod || '',
				preferred_language: contact.demographics?.preferredLanguage || '',
				preferred_language_other: contact.demographics?.preferredLanguageOther || '',
				preferred_contact_time: contact.demographics?.preferredContactTime || ''
			},
			attributes: contact?.attributes || undefined
		}

		await this.#contacts.updateItem(
			{ id: dbContact.id },
			{
				$set: changedData
			}
		)

		const offset = this.#config.defaultPageOffset
		const limit = this.#config.defaultPageLimit

		const engagements = await this.#engagements.items(
			{ offset, limit },
			{
				contacts: dbContact.id
			}
		)
		const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))

		const orgData = await this.#orgs.itemById(contact.orgId)
		const attributes: Attribute[] = []
		changedData.attributes?.forEach((attrId) => {
			const attr = orgData.item?.attributes?.find((a) => a.id === attrId)
			if (attr) {
				attributes.push(createGQLAttribute(attr))
			}
		})

		return {
			contact: createGQLContact(changedData, eng, attributes),
			message: this.#localization.t('mutation.updateContact.success'),
			status: StatusType.Success
		}
	}
}
