/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'

module.exports = {
	async up(db: Db) {
		try {
			await db
				.collection('engagements')
				.find()
				.forEach(async (engagement) => {
					const title = engagement.description.split(' ').slice(0, 5).join(' ')
					await db
						.collection('engagements')
						.updateOne({ _id: engagement._id }, { $set: { title: title } })
				})
		} catch (error) {
			throw error
		}
	},

	async down(db: Db) {
		try {
			await db.collection('engagements').updateMany({}, { $unset: { title: '' } })
		} catch (error) {
			throw error
		}
	}
}
