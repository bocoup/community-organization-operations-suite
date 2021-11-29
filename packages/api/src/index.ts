/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-console */
import 'reflect-metadata'
import dotenv from 'dotenv'
import { container } from 'tsyringe'

async function bootstrap() {
	process.on('unhandledRejection', (reason) => {
		console.error('caught unhandled rejection', reason)
	})

	dotenv.config({ debug: true })
	// import these components after configuring dotenv so config stack isn't polluted
	const { AppBuilder } = await import('./components/AppBuilder')
	const { Configuration } = await import('./components/Configuration')
	const { DatabaseConnector } = await import('./components/DatabaseConnector')
	const { StartupMigrator } = await import('./components/StartupMigrator')
	const { createLogger } = await import('./utils/createLogger')
	const logger = createLogger('boostrap', true)

	logger('validating configuration')
	await container.resolve(Configuration).validate()

	logger('establishing database connection')
	const dbConnector = await container.resolve(DatabaseConnector)
	await dbConnector.connect()

	logger('performing db migrations')
	const startupMigrator = await container.resolve(StartupMigrator)
	await startupMigrator.execute()

	logger('starting server')
	const appBuilder = container.resolve(AppBuilder)
	await appBuilder.start()
}

bootstrap()
