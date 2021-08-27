/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Db } from 'mongodb'

module.exports = {
	async up(db: Db) {
		try {
			await db.createCollection('services')
		} catch (error) {
			throw error
		}
	},

	async down(db: Db) {
		try {
			await db.dropCollection('services')
		} catch (error) {
			throw error
		}
	}
}
