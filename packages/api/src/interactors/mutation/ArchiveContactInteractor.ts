/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MutationArchiveContactArgs, VoidResponse } from '@cbosuite/schema/dist/provider-types'
import { ContactStatus } from '@cbosuite/schema/dist/provider-types'
import { UserInputError } from 'apollo-server-errors'
import type { Interactor, RequestContext } from '~types'
import { SuccessVoidResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import type { Localization } from '~components/Localization'
import type { ContactCollection } from '~db/ContactCollection'
import type { Telemetry } from '~components/Telemetry'

@singleton()
export class ArchiveContactInteractor
	implements Interactor<unknown, MutationArchiveContactArgs, VoidResponse>
{
	public constructor(
		private localization: Localization,
		private contacts: ContactCollection,
		private telemetry: Telemetry
	) {}

	public async execute(
		_: unknown,
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
