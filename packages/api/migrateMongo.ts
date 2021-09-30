/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @essex/adjacent-await */
import { Migrator } from './src/components/Migrator'
require('dotenv').config()
const appConfig = require('config')
const { Configuration } = require('./src/components/Configuration')

/**
 * Wrapper around migrate-mongo to enable typescript support and load config api components
 */
async function migration() {
	const [, , command, migrationNameToCreate] = process.argv
	console.log('launching migrator', process.env.NODE_CONFIG_ENV || process.env.NODE_ENV)
	const migrator = new Migrator(new Configuration(appConfig))
	await migrator.connect()

	switch (command) {
		case 'init':
			await migrator.init()
			console.log('Initialized migrate-mongo')
			break
		case 'create':
			const migration = await migrator.create(migrationNameToCreate)
			console.log('Created migration', migration)
			break
		case 'up':
			await migrator.up()
			break
		case 'down':
			await migrator.down()
			break
		case 'status':
			const status = await migrator.status()
			console.log(status)
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
}

migration()
	.then(() => {
		console.log('finished migrations')
		process.exit(0)
	})
	.catch((err) => {
		console.log(err)
		process.exit(1)
	})
