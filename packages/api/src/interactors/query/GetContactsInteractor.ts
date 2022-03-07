/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Contact, QueryContactsArgs } from '@cbosuite/schema/dist/provider-types'
import { ForbiddenError } from 'apollo-server'
import { singleton } from 'tsyringe'
import type { ContactCollection } from '~db/ContactCollection'
import { createGQLContact } from '~dto'
import type { Interactor, RequestContext } from '~types'

@singleton()
export class GetContactsInteractor implements Interactor<unknown, QueryContactsArgs, Contact[]> {
	public constructor(
		private contacts: ContactCollection,
		private defaultPageOffset: number,
		private defaultPageLimit: number
	) {}

	public async execute(
		_: unknown,
		{ orgId, offset, limit }: QueryContactsArgs,
		ctx: RequestContext
	): Promise<Contact[]> {
		offset = offset ?? this.defaultPageOffset
		limit = limit ?? this.defaultPageLimit

		if (!ctx.identity?.roles.some((r) => r.org_id === orgId)) {
			throw new ForbiddenError(`You are not in organization ${orgId}`)
		}

		const dbContacts = await this.contacts.items({ offset, limit }, { org_id: orgId })
		const contactList = dbContacts.items.map(createGQLContact)
		return contactList.sort((a: Contact, b: Contact) => (a.name.first > b.name.first ? 1 : -1))
	}
}
