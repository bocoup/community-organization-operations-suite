/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Db } from 'mongodb'

// DO NOT CHANGE THE NEXT LINE module.exports is needed for migrate-mongo to funciton properly
module.exports = {
	async up(db: Db) {
		console.log('Migrate up')
		// TODO write your migration here.
		// See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
		// Example:
		// await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
	},

	async down(db: Db) {
		console.log('Migrate down')
		// TODO write the statements to rollback your migration (if possible)
		// Example:
		// await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
	}
}
