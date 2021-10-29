/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import { DatabaseConnector } from '~components/DatabaseConnector'
import { CollectionBase } from './CollectionBase'
import type { DbEngagement } from './types'

@singleton()
export class EngagementCollection extends CollectionBase<DbEngagement> {
	public constructor(connector: DatabaseConnector) {
		super(connector.engagementsCollection)
	}
}
