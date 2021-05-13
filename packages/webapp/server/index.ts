/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import conf from 'config'
import { Configuration } from './Configuration'
import { createServer } from './createServer'
import { getNextHandler } from './getNextHandler'

export async function bootstrap(): Promise<void> {
	try {
		const config = new Configuration(conf)
		const server = createServer(config)
		const handle = await getNextHandler(config)
		server.all('*', (req, res) => handle(req, res))
		const port = config.port
		server.listen(port, () => {
			console.log(`🚀 greenlight app ready on http://localhost:${port}`)
		})
		console.log('server finished')
	} catch (err) {
		console.log('error starting server (in bootstrap)', err)
		throw err
	}
}
