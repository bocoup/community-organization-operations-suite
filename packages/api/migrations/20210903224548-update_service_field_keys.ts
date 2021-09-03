/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Db } from 'mongodb'

module.exports = {
	async up(db: Db) {
		try {
			await Promise.all([
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'single-text' },
						{ $set: { 'customFields.$.fieldType': 'singleText' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'multiline-text' },
						{ $set: { 'customFields.$.fieldType': 'multilineText' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'single-choice' },
						{ $set: { 'customFields.$.fieldType': 'singleChoice' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'multi-text' },
						{ $set: { 'customFields.$.fieldType': 'multiText' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'multi-choice' },
						{ $set: { 'customFields.$.fieldType': 'multiChoice' } }
					),
				db.collection('services').updateMany({}, { $unset: { contacts: '' } })
			])
		} catch (error) {
			throw error
		}
	},

	async down(db: Db) {
		try {
			await Promise.all([
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'singleText' },
						{ $set: { 'customFields.$.fieldType': 'single-text' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'multilineText' },
						{ $set: { 'customFields.$.fieldType': 'multiline-text' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'singleChoice' },
						{ $set: { 'customFields.$.fieldType': 'single-choice' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'multiText' },
						{ $set: { 'customFields.$.fieldType': 'multi-text' } }
					),
				db
					.collection('services')
					.updateMany(
						{ 'customFields.fieldType': 'multiChoice' },
						{ $set: { 'customFields.$.fieldType': 'multi-choice' } }
					),
				db.collection('services').updateMany({}, { $set: { contacts: [] } })
			])
		} catch (error) {
			throw error
		}
	}
}
