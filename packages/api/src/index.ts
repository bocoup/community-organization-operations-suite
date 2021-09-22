/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import dotenv from 'dotenv'

async function bootstrap() {
	process.on('unhandledRejection', (reason) => {
		console.log('caught unhandled rejection', reason)
	})

	dotenv.config({ debug: true })
	const { startup } = await import('./startup')
	startup()
}

bootstrap()
