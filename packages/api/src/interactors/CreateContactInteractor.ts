/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MutationCreateContactArgs, ContactResponse } from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ContactCollection } from '~db'
import { createGQLContact } from '~dto'
import { createDBContact } from '~dto/createDBContact'
import { Interactor } from '~types'
import { FailedResponse, SuccessContactResponse } from '~utils/response'

export class CreateContactInteractor
	implements Interactor<MutationCreateContactArgs, ContactResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly contacts: ContactCollection
	) {}

	public async execute({ contact }: MutationCreateContactArgs): Promise<ContactResponse> {
		if (!contact.orgId) {
			return new FailedResponse(this.localization.t('mutation.createContact.orgIdRequired'))
		}

		const newContact = createDBContact(contact)
		await this.contacts.insertItem(newContact)

		return new SuccessContactResponse(
			this.localization.t('mutation.createContact.success'),
			createGQLContact(newContact)
		)
	}
}
