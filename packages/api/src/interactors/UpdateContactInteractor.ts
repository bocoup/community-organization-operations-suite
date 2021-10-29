/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationUpdateContactArgs, ContactResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { createGQLContact } from '~dto'
import { Interactor, RequestContext } from '~types'
import { emptyStr } from '~utils/noop'
import { SuccessContactResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { ContactCollection } from '~db/ContactCollection'
import { Telemetry } from '~components/Telemetry'
import { DbContact } from '~db/types'

@singleton()
export class UpdateContactInteractor
	implements Interactor<MutationUpdateContactArgs, ContactResponse>
{
	public constructor(
		private localization: Localization,
		private contacts: ContactCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		{ contact }: MutationUpdateContactArgs,
		{ locale }: RequestContext
	): Promise<ContactResponse> {
		if (!contact.id) {
			throw new UserInputError(
				this.localization.t('mutation.updateContact.contactIdRequired', locale)
			)
		}

		if (!contact.orgId) {
			throw new UserInputError(this.localization.t('mutation.updateContact.orgIdRequired', locale))
		}

		const result = await this.contacts.itemById(contact.id)
		if (!result.item) {
			throw new UserInputError(this.localization.t('mutation.updateContact.userNotFound', locale))
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
						street: contact.address?.street || emptyStr,
						unit: contact.address?.unit || emptyStr,
						city: contact.address?.city || emptyStr,
						county: contact.address?.county || emptyStr,
						state: contact.address?.state || emptyStr,
						zip: contact.address?.zip || emptyStr
				  }
				: undefined,
			demographics: {
				gender: contact.demographics?.gender || emptyStr,
				gender_other: contact.demographics?.genderOther || emptyStr,
				ethnicity: contact.demographics?.ethnicity || emptyStr,
				ethnicity_other: contact.demographics?.ethnicityOther || emptyStr,
				race: contact.demographics?.race || emptyStr,
				race_other: contact.demographics?.raceOther || emptyStr,
				preferred_contact_method: contact.demographics?.preferredContactMethod || emptyStr,
				preferred_language: contact.demographics?.preferredLanguage || emptyStr,
				preferred_language_other: contact.demographics?.preferredLanguageOther || emptyStr,
				preferred_contact_time: contact.demographics?.preferredContactTime || emptyStr
			},
			tags: contact?.tags || undefined
		}

		await this.contacts.updateItem({ id: dbContact.id }, { $set: changedData })

		this.telemetry.trackEvent('UpdateContact')
		return new SuccessContactResponse(
			this.localization.t('mutation.updateContact.success', locale),
			createGQLContact(changedData)
		)
	}
}
