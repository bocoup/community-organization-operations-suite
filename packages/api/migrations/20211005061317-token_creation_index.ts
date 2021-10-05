/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'

module.exports = {
	async up(db: Db) {
		await db.collection('user_tokens').createIndex([['created', 1]])
	},

	async down(db: Db) {
		db.collection('user_tokens').dropIndex('created_1')
	}
}
