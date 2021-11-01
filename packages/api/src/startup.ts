/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import http from 'http'
import path from 'path'
import fs from 'fs'
import { container } from 'tsyringe'
import { createLogger } from '~utils'
import { Configuration } from '~components/Configuration'
import { DatabaseConnector } from '~components/DatabaseConnector'
import { AppBuilder } from '~components/AppBuilder'
import { Migrator } from '~components/Migrator'

const logger = createLogger('startup', true)

export async function startup(): Promise<http.Server> {
	try {
		const config = container.resolve(Configuration)
		logger('validating configuration')
		config.validate()
		logger('performing startup migrations')
		const migrator = container.resolve(Migrator)
		await performDatabaseMigrationsAndSeeding(config, migrator)
		logger('initializing database connection')
		const connector = container.resolve(DatabaseConnector)
		await connector.connect()
		logger(`preparing server`)
		const appBuilder = container.resolve(AppBuilder)
		return appBuilder.start()
	} catch (err) {
		logger('error starting app', err)
		throw err
	}
}

async function performDatabaseMigrationsAndSeeding(config: Configuration, migrator: Migrator) {
	// This should prevent accidental seed data from accidentally being inserted into Azure environments
	// (e.g. when a dev uses an env-var override locally)
	const isDbTargetStable = config.dbSeedConnectionString === config.dbConnectionString
	if (!isDbTargetStable) {
		logger('unstable db target, skipping migration & seeding')
	} else {
		await migrator.connect()

		if (config.dbAutoMigrate) {
			await migrator.up()
		}

		if (config.dbSeedMockData) {
			const SEED_ROOT = path.join(__dirname, '../mock_data')
			const isSeedFolderPresent = fs.existsSync(SEED_ROOT)

			if (isSeedFolderPresent) {
				const seedFiles = fs.readdirSync(SEED_ROOT).map((f) => path.join(SEED_ROOT, f))
				// Seed the mock data fresh (delete old data)
				await migrator.seed(seedFiles, true)
			} else {
				logger('no seed data present, skipping db seeding')
			}
		}
	}
}
