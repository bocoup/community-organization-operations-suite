/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ContactIdInput, VoidResponse, ContactStatus } from '@cbosuite/schema/dist/provider-types'
import { Configuration, Localization } from '~components'
import { ContactCollection } from '~db'
import { Interactor } from '~types'
import { FailedVoidResponse, SuccessVoidResponse } from '~utils/response'

export class ArchiveContactInteractor implements Interactor<ContactIdInput, VoidResponse> {
	#localization: Localization
	#contacts: ContactCollection

	public constructor(
		localization: Localization,
		config: Configuration,
		contacts: ContactCollection
	) {
		this.#localization = localization
		this.#contacts = contacts
		this.#contacts = contacts
	}

	public async execute({ contactId }: ContactIdInput): Promise<VoidResponse> {
		if (!contactId) {
			return new FailedVoidResponse(
				this.#localization.t('mutation.updateContact.contactIdRequired')
			)
		}

		await this.#contacts.updateItem({ id: contactId }, { $set: { status: ContactStatus.Archived } })

		return new SuccessVoidResponse(this.#localization.t('mutation.updateContact.success'))
	}
}
