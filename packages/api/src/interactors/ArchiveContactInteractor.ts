/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationArchiveContactArgs,
	VoidResponse,
	ContactStatus
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import { Localization, Telemetry } from '~components'
import { ContactCollection } from '~db'
import { Interactor, RequestContext } from '~types'
import { SuccessVoidResponse } from '~utils/response'
import { singleton } from 'tsyringe'

@singleton()
export class ArchiveContactInteractor
	implements Interactor<MutationArchiveContactArgs, VoidResponse>
{
	public constructor(
		private readonly localization: Localization,
		private readonly contacts: ContactCollection,
		private readonly telemetry: Telemetry
	) {}

	public async execute(
		{ contactId }: MutationArchiveContactArgs,
		{ locale }: RequestContext
	): Promise<VoidResponse> {
		if (!contactId) {
			throw new UserInputError(
				this.localization.t('mutation.updateContact.contactIdRequired', locale)
			)
		}

		await this.contacts.updateItem({ id: contactId }, { $set: { status: ContactStatus.Archived } })
		this.telemetry.trackEvent('ArchiveContact')
		return new SuccessVoidResponse(this.localization.t('mutation.updateContact.success', locale))
	}
}
