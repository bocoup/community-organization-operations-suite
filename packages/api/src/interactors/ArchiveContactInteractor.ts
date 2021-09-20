/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ContactIdInput,
	VoidResponse,
	StatusType,
	ContactStatus
} from '@cbosuite/schema/dist/provider-types'
import { Configuration, Localization } from '~components'
import { ContactCollection, TagCollection, EngagementCollection, OrganizationCollection } from '~db'
import { Interactor } from '~types'

export class ArchiveContactInteractor implements Interactor<ContactIdInput, VoidResponse> {
	#localization: Localization
	#config: Configuration
	#contacts: ContactCollection
	#tags: TagCollection
	#engagements: EngagementCollection
	#orgs: OrganizationCollection

	public constructor(
		localization: Localization,
		config: Configuration,
		contacts: ContactCollection,
		tags: TagCollection,
		engagements: EngagementCollection,
		orgs: OrganizationCollection
	) {
		this.#localization = localization
		this.#config = config
		this.#contacts = contacts
		this.#contacts = contacts
		this.#engagements = engagements
		this.#orgs = orgs
		this.#tags = tags
	}

	public async execute({ contactId }: ContactIdInput): Promise<VoidResponse> {
		if (!contactId) {
			return {
				message: this.#localization.t('mutation.updateContact.contactIdRequired'),
				status: StatusType.Failed
			}
		}

		await this.#contacts.updateItem({ id: contactId }, { $set: { status: ContactStatus.Archived } })

		return {
			message: this.#localization.t('mutation.updateContact.success'),
			status: StatusType.Success
		}
	}
}
