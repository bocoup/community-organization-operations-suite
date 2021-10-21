/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationArchiveContactArgs,
	VoidResponse,
	ContactStatus
} from '@cbosuite/schema/dist/provider-types'
import { Localization } from '~components'
import { ContactCollection } from '~db'
import { Interactor } from '~types'
import { FailedResponse, SuccessVoidResponse } from '~utils/response'

export class ArchiveContactInteractor
	implements Interactor<MutationArchiveContactArgs, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly contacts: ContactCollection
	) {}

	public async execute({ contactId }: MutationArchiveContactArgs): Promise<VoidResponse> {
		if (!contactId) {
			return new FailedResponse(this.localization.t('mutation.updateContact.contactIdRequired'))
		}

		await this.contacts.updateItem({ id: contactId }, { $set: { status: ContactStatus.Archived } })

		return new SuccessVoidResponse(this.localization.t('mutation.updateContact.success'))
	}
}
