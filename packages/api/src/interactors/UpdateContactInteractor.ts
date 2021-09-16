/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContactInput, ContactResponse, StatusType } from '@cbosuite/schema/dist/provider-types'
import { Configuration, Localization } from '~components'
import {
	ContactCollection,
	TagCollection,
	DbContact,
	EngagementCollection,
	OrganizationCollection
} from '~db'
import { createGQLContact, createGQLEngagement, createGQLTag } from '~dto'
import { Interactor } from '~types'

export class UpdateContactInteractor implements Interactor<ContactInput, ContactResponse> {
	#localization: Localization
	#config: Configuration
	#contacts: ContactCollection
	#tags: TagCollection
	#engagements: EngagementCollection
	#orgs: OrganizationCollection

	public constructor(
		localization: Localization,
		config: Configuration,
		contacts: ContactCollection,
		tags: TagCollection,
		engagements: EngagementCollection,
		orgs: OrganizationCollection
	) {
		this.#localization = localization
		this.#config = config
		this.#contacts = contacts
		this.#contacts = contacts
		this.#engagements = engagements
		this.#orgs = orgs
		this.#tags = tags
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
				gender_other: contact.demographics?.genderOther || '',
				ethnicity: contact.demographics?.ethnicity || '',
				ethnicity_other: contact.demographics?.ethnicityOther || '',
				race: contact.demographics?.race || '',
				race_other: contact.demographics?.raceOther || '',
				preferred_contact_method: contact.demographics?.preferredContactMethod || '',
				preferred_language: contact.demographics?.preferredLanguage || '',
				preferred_language_other: contact.demographics?.preferredLanguageOther || '',
				preferred_contact_time: contact.demographics?.preferredContactTime || ''
			},
			tags: contact?.tags || undefined
		}

		await this.#contacts.updateItem(
			{ id: dbContact.id },
			{
				$set: changedData
			}
		)

		const offset = this.#config.defaultPageOffset
		const limit = this.#config.defaultPageLimit

		// FIXME: this will not work to query engagements with multiple contacts
		// Get contact engagements
		const engagements = await this.#engagements.items(
			{ offset, limit },
			{
				contacts: dbContact.id
			}
		)
		const eng = engagements.items.map((engagement) => createGQLEngagement(engagement))

		// Get contact tags
		const dbTagResponse = await this.#tags.items({}, { id: { $in: contact.tags ?? [] } })
		const tags = dbTagResponse.items?.map((dbTag) => createGQLTag(dbTag))

		return {
			contact: createGQLContact(changedData, eng, tags),
			message: this.#localization.t('mutation.updateContact.success'),
			status: StatusType.Success
		}
	}
}
