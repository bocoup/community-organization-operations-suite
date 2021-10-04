/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import dotenv from 'dotenv'
import { createLogger } from '~utils/createLogger'
const logger = createLogger('bootstrap', true)

async function bootstrap() {
	process.on('unhandledRejection', (reason) => {
		logger('caught unhandled rejection', reason)
	})

	dotenv.config({ debug: true })
	const { startup } = await import('./startup')
	await startup()
}

bootstrap()
