/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	MutationCreateContactArgs,
	ContactResponse
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { createGQLContact } from '~dto'
import { createDBContact } from '~dto/createDBContact'
import type { Interactor, RequestContext } from '~types'
import { SuccessContactResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import type { Localization } from '~components/Localization'
import type { ContactCollection } from '~db/ContactCollection'
import type { Telemetry } from '~components/Telemetry'

@singleton()
export class CreateContactInteractor
	implements Interactor<unknown, MutationCreateContactArgs, ContactResponse>
{
	public constructor(
		private localization: Localization,
		private contacts: ContactCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
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
