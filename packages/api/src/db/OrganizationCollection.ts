/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import { DatabaseConnector } from '~components/DatabaseConnector'
import { CollectionBase } from './CollectionBase'
import type { DbOrganization } from './types'

@singleton()
export class OrganizationCollection extends CollectionBase<DbOrganization> {
	public constructor(connector: DatabaseConnector) {
		super(connector.orgsCollection)
	}
}
