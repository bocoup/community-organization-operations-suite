/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Db, MongoClient } from 'mongodb'

module.exports = {
	async up(db: Db, client: MongoClient) {
		// Drop tokens table
		if (await db.listCollections({ name: 'user_tokens' }).hasNext()) {
			const tokens = db.collection('user_tokens')
			await tokens.drop()
		}

		// Drop fan-outs, query related tables with org_id criteria instead
		const orgs = db.collection('organizations')
		await orgs.updateMany({}, { $unset: { users: 1, contacts: 1, tags: 1 } })
	},

	async down(db: Db, client: MongoClient) {}
}
