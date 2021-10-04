/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Migrator } from './src/components/Migrator'
import { createLogger } from './src/utils'
require('dotenv').config()
const appConfig = require('config')
const { Configuration } = require('./src/components/Configuration')
const logger = createLogger('migrator', true)

/**
 * Wrapper around migrate-mongo to enable typescript support and load config api components
 */
async function migration() {
	const [, , command, migrationNameToCreate] = process.argv
	logger('launching migrator', process.env.NODE_CONFIG_ENV || process.env.NODE_ENV)
	const migrator = new Migrator(new Configuration(appConfig))
	await migrator.connect()

	switch (command) {
		case 'init':
			await migrator.init()
			logger('Initialized migrate-mongo')
			break
		case 'create':
			const migration = await migrator.create(migrationNameToCreate)
			logger('Created migration', migration)
			break
		case 'up':
			await migrator.up()
			break
		case 'down':
			await migrator.down()
			break
		case 'status':
			const status = await migrator.status()
			logger(status)
			break
		default:
			logger('No command provided to migrate-mongo')
			logger('Please use one of the following commands:')
			logger('- create <name_of_migration>')
			logger('- up')
			logger('- down')
			logger('- status')
			break
	}
}

migration()
	.then(() => {
		logger('finished migrations')
		process.exit(0)
	})
	.catch((err) => {
		logger(err)
		process.exit(1)
	})
