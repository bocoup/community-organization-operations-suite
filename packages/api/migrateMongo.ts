/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { create, database, config, up, down, status, init } from 'migrate-mongo'
import { migrateMongoConfig } from './migrate-mongo-config'

config.set(migrateMongoConfig)

/**
 * Wrapper around migrate-mongo to enable typescript support and load config api components
 */
async function migration() {
	const [, , command, migrationNameToCreate] = process.argv

	try {
		const { db } = await database.connect()

		switch (command) {
			case 'init':
				await init()
				console.log('Initialized migrate-mongo')
				break
			case 'create':
				if (!migrationNameToCreate) {
					throw new Error(
						'No migration name provided to migrate-mongo create. Please provide a valid migration name.'
					)
				}

				const migration = await create(migrationNameToCreate)
				console.log('Created migration', migration)
				break
			case 'up':
				const migrated = await up(db)
				migrated.forEach((fileName) => console.log('Migrated:', fileName))
				break
			case 'down':
				const migratedDown = await down(db)
				migratedDown.forEach((fileName) => console.log('Migrated Down:', fileName))
				break
			case 'status':
				const migrationStatus = await status(db)
				migrationStatus.forEach(({ fileName, appliedAt }) => console.log(fileName, ':', appliedAt))
				break
			default:
				console.log('No command provided to migrate-mongo')
				console.log('Please use one of the following commands:')
				console.log('- create <name_of_migration>')
				console.log('- up')
				console.log('- down')
				console.log('- status')
				break
		}
	} catch (error) {
		console.log('Migate-mongo failed', error)
	}
}

migration()
