/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import { DatabaseConnector } from '~components/DatabaseConnector'
import { CollectionBase } from './CollectionBase'
import type { DbContact } from './types'

@singleton()
export class ContactCollection extends CollectionBase<DbContact> {
	public constructor(connector: DatabaseConnector) {
		super(connector.contactsCollection)
	}
	public findContactsWithOrganization(orgId: string, offset = 0, limit = 100) {
		return this.items({ offset, limit }, { org_id: orgId })
	}
}
