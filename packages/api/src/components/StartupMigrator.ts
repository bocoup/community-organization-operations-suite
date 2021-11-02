/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Configuration } from './Configuration'
import { Migrator } from './Migrator'
import path from 'path'
import fs from 'fs'
import { singleton } from 'tsyringe'
import { createLogger } from '~utils'

const SEED_ROOT = path.join(__dirname, '../../mock_data')

const logger = createLogger('migrator', true)

@singleton()
export class StartupMigrator {
	public constructor(private readonly migrator: Migrator, private readonly config: Configuration) {}

	public async execute() {
		const { dbConnectionString, dbSeedConnectionString, dbSeedMockData, dbAutoMigrate } =
			this.config

		// This should prevent accidental seed data from accidentally being inserted into Azure environments
		// (e.g. when a dev uses an env-var override locally)
		const isDbTargetStable = dbSeedConnectionString === dbConnectionString
		if (!isDbTargetStable) {
			logger('unstable db target, skipping migration & seeding')
		} else {
			await this.migrator.connect()

			if (dbAutoMigrate) {
				await this.migrator.up()
			}

			if (dbSeedMockData) {
				const isSeedFolderPresent = fs.existsSync(SEED_ROOT)

				if (isSeedFolderPresent) {
					const seedFiles = fs.readdirSync(SEED_ROOT).map((f) => path.join(SEED_ROOT, f))
					// Seed the mock data fresh (delete old data)
					await this.migrator.seed(seedFiles, true)
				} else {
					logger('no seed data present, skipping db seeding')
				}
			}
		}
	}
}
