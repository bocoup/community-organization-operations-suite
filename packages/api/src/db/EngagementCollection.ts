/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import type { DatabaseConnector } from '~components/DatabaseConnector'
import { CollectionBase } from './CollectionBase'
import type { DbEngagement } from './types'

@singleton()
export class EngagementCollection extends CollectionBase<DbEngagement> {
	public constructor(connector: DatabaseConnector) {
		super(connector.engagementsCollection)
	}

	public countWithTagsInOrg(orgId: string, tagId: string): Promise<number> {
		return this.count({ org_id: { $eq: orgId }, tags: { $eq: tagId } })
	}
}
