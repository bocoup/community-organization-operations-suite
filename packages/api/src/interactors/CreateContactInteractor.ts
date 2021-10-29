/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateContactArgs, ContactResponse } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization } from '~components'
import { ContactCollection } from '~db'
import { createGQLContact } from '~dto'
import { createDBContact } from '~dto/createDBContact'
import { Interactor, RequestContext } from '~types'
import { SuccessContactResponse } from '~utils/response'
import { Telemetry } from '~components/Telemetry'

export class CreateContactInteractor
	implements Interactor<MutationCreateContactArgs, ContactResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly contacts: ContactCollection,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ contact }: MutationCreateContactArgs,
		{ locale }: RequestContext
	): Promise<ContactResponse> {
		if (!contact.orgId) {
			throw new UserInputError(this.localization.t('mutation.createContact.orgIdRequired', locale))
		}

		const newContact = createDBContact(contact)
		await this.contacts.insertItem(newContact)

		this.telemetry.trackEvent('CreateContact')
		return new SuccessContactResponse(
			this.localization.t('mutation.createContact.success', locale),
			createGQLContact(newContact)
		)
	}
}
