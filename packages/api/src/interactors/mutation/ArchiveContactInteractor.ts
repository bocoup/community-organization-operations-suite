/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	MutationArchiveContactArgs,
	VoidResponse,
	ContactStatus
} from '@cbosuite/schema/dist/provider-types'
import { UserInputError, ForbiddenError } from 'apollo-server-errors'
import { Interactor, RequestContext } from '~types'
import { SuccessVoidResponse } from '~utils/response'
import { singleton } from 'tsyringe'
import { Localization } from '~components/Localization'
import { ContactCollection } from '~db/ContactCollection'
import { Telemetry } from '~components/Telemetry'
import { createAuditLog } from '~utils/audit'

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
		{ locale, identity }: RequestContext
	): Promise<VoidResponse> {
		if (!identity?.id) throw new ForbiddenError('not authenticated')
		if (!contactId) {
			throw new UserInputError(
				this.localization.t('mutation.updateContact.contactIdRequired', locale)
			)
		}

		const [audit_log, update_date] = createAuditLog('archive contact', identity.id)
		await this.contacts.updateItem(
			{ id: contactId },
			{
				$set: { status: ContactStatus.Archived, update_date },
				$push: { audit_log }
			}
		)
		this.telemetry.trackEvent('ArchiveContact')
		return new SuccessVoidResponse(this.localization.t('mutation.updateContact.success', locale))
	}
}
