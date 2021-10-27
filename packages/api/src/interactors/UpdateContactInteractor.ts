/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateContactArgs, ContactResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ContactCollection, DbContact } from '~db'
import { createGQLContact } from '~dto'
import { Interactor, RequestContext } from '~types'
import { FailedResponse, SuccessContactResponse } from '~utils/response'

export class UpdateContactInteractor
	implements Interactor<MutationUpdateContactArgs, ContactResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly contacts: ContactCollection
	) {}

	public async execute(
		{ contact }: MutationUpdateContactArgs,
		{ locale }: RequestContext
	): Promise<ContactResponse> {
		if (!contact.id) {
			return new FailedResponse(
				this.localization.t('mutation.updateContact.contactIdRequired', locale)
			)
		}

		if (!contact.orgId) {
			return new FailedResponse(this.localization.t('mutation.updateContact.orgIdRequired', locale))
		}

		const result = await this.contacts.itemById(contact.id)
		if (!result.item) {
			return new FailedResponse(this.localization.t('mutation.updateContact.userNotFound', locale))
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
						county: contact.address?.county || '',
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

		await this.contacts.updateItem(
			{ id: dbContact.id },
			{
				$set: changedData
			}
		)

		return new SuccessContactResponse(
			this.localization.t('mutation.updateContact.success', locale),
			createGQLContact(changedData)
		)
	}
}
