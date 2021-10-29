/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import http from 'http'
import path from 'path'
import fs from 'fs'
import { container } from 'tsyringe'
import { createLogger } from '~utils'
import { Migrator, DatabaseConnector, AppBuilder, Configuration } from '~components'

const logger = createLogger('startup', true)

export async function startup(): Promise<http.Server> {
	try {
		logger('performing startup migrations')
		await performDatabaseMigrationsAndSeeding()
		connectToDatabase()
		logger(`preparing server`)
		const appBuilder = container.resolve(AppBuilder)
		logger('starting server...')
		return appBuilder.start()
	} catch (err) {
		logger('error starting app', err)
		throw err
	}
}

async function connectToDatabase() {
	const connector = container.resolve(DatabaseConnector)
	await connector.connect()
}

async function performDatabaseMigrationsAndSeeding() {
	const config = container.resolve(Configuration)
	// This should prevent accidental seed data from accidentally being inserted into Azure environments
	// (e.g. when a dev uses an env-var override locally)
	const isSeedTargetStable = config.dbSeedConnectionString === config.dbConnectionString
	if (!isSeedTargetStable) {
		logger('unstable seed target, skipping DB seeding')
	} else {
		const migrator = container.resolve(Migrator)
		await migrator.connect()

		if (config.dbAutoMigrate) {
			await migrator.up()
		}

		if (config.dbSeedMockData) {
			const SEED_FILE_ROOT = path.join(__dirname, '../mock_data')
			const seedFiles = fs.readdirSync(SEED_FILE_ROOT).map((f) => path.join(SEED_FILE_ROOT, f))
			// Seed the mock data fresh (delete old data)
			await migrator.seed(seedFiles, true)
		}
	}
}
