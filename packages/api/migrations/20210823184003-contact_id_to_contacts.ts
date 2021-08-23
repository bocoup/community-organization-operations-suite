/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Db } from 'mongodb'

module.exports = {
	async up(db: Db) {
		try {
			await db.collection('engagements').updateMany({}, { $rename: { contact_id: 'contacts' } })
			await db
				.collection('engagements')
				.find()
				.forEach(async (engagement) => {
					await db
						.collection('engagements')
						.updateOne({ _id: engagement._id }, { $set: { contacts: [engagement.contacts] } })
				})
		} catch (error) {
			throw error
		}
	},

	async down(db: Db) {
		try {
			await db.collection('engagements').updateMany({}, { $rename: { contacts: 'contact_id' } })
			await db
				.collection('engagements')
				.find()
				.forEach(async (engagement) => {
					await db
						.collection('engagements')
						.updateOne({ _id: engagement._id }, { $set: { contact_id: engagement.contact_id[0] } })
				})
		} catch (error) {
			throw error
		}
	}
}
