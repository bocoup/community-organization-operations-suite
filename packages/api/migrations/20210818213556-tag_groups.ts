/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Db } from 'mongodb'
import { v4 as createId } from 'uuid'
import { createLogger } from '../src/utils/createLogger'
const logger = createLogger('migrations', true)

// DO NOT CHANGE THE NEXT LINE module.exports is needed for migrate-mongo to funciton properly
module.exports = {
	async up(db: Db) {
		// Create tag groups collection
		try {
			await db.createCollection('tag_groups')
		} catch (error) {
			throw error
		}

		// Create groups to tag groups collection
		try {
			const tagGroupsToAdd = [
				{
					label: 'SDOH',
					id: createId()
				},
				{
					label: 'PROGRAM',
					id: createId()
				},
				{
					label: 'GRANT',
					id: createId()
				},
				{
					label: 'OTHER',
					id: createId()
				}
			]

			await db.collection('tag_groups').insertMany(tagGroupsToAdd)
		} catch (error) {
			throw error
		}
	},

	async down(db: Db) {
		try {
			db.dropCollection('tag_groups')
		} catch (error) {
			logger('No tag groups collection')
		}
	}
}
