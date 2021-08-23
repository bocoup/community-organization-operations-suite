/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Db } from 'mongodb'
import { DbTag, DbOrganization } from '../src/db/types'

// DO NOT CHANGE THE NEXT LINE module.exports is needed for migrate-mongo to funciton properly
module.exports = {
	async up(db: Db) {
		// Create tags collection
		try {
			await db.createCollection('tags')
		} catch (error) {
			throw error
		}

		// Move tags from organization
		try {
			// Get all orgs
			await db
				.collection('organizations')
				.find()
				.forEach(async (org: DbOrganization) => {
					// For each tag in each org
					const newOrgTags = org.tags.map((tag: DbTag) => {
						// Add a group and org_id to the tag
						const nextTag = { ...tag, org_id: org.id }

						// Move the tag to the tags collection
						db.collection('tags').insertOne(nextTag)

						// Replace current tag with tag id
						return tag.id
					})

					// Update the current organization with a list of tags
					db.collection('organizations').updateOne(
						{ id: org.id },
						{
							$set: {
								tags: newOrgTags
							}
						}
					)
				})
		} catch (error) {
			throw error
		}
	},

	async down(db: Db) {
		// Move tags to organization
		try {
			// Get all orgs
			await db
				.collection('organizations')
				.find()
				.forEach(async (org) => {
					// For each tag in each org
					const newOrgTags = await Promise.all(
						org.tags.map(async (tag: string) => {
							// Get the tag from the tags collection
							const _tag = await db.collection('tags').findOne({ id: tag })

							// Drop the group and org id attribute
							delete _tag.group
							delete _tag.org_id

							// Replace current tag with tag id
							return _tag
						})
					)

					console.log('newOrgTags', newOrgTags)

					// Update the current organization with a list of tags
					db.collection('organizations').updateOne(
						{ id: org.id },
						{
							$set: {
								tags: newOrgTags
							}
						}
					)
				})
		} catch (error) {
			throw error
		}

		// Drop tags collection
		try {
			await db.dropCollection('tags')
		} catch (error) {
			throw error
		}
	}
}
