/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable no-console */
import 'reflect-metadata'
import dotenv from 'dotenv'

async function bootstrap() {
	process.on('unhandledRejection', (reason) => {
		console.error('caught unhandled rejection', reason)
	})

	dotenv.config({ debug: true })
	const { startup } = await import('./startup')
	await startup()
}

bootstrap()
