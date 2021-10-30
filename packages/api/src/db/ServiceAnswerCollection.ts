/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { singleton } from 'tsyringe'
import { DatabaseConnector } from '~components/DatabaseConnector'
import { CollectionBase } from './CollectionBase'
import { DbServiceAnswer } from './types'

@singleton()
export class ServiceAnswerCollection extends CollectionBase<DbServiceAnswer> {
	public constructor(connector: DatabaseConnector) {
		super(connector.serviceAnswerCollection)
	}
}
