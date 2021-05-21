/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppBuilder, Configuration, AppContextProvider } from '~components'

async function startup() {
	try {
		console.log(`preparing server`)
		const config = new Configuration()
		config.validate()
		const contextProvider = new AppContextProvider(config)
		const appBuilder = new AppBuilder(contextProvider)
		const app = await appBuilder.build()

		console.log('starting server...')
		app.listen(config.port, config.host, (err, address) => {
			if (err) {
				console.error('error starting api', err)
				throw err
			} else {
				console.log(
					`🚀 services app listening at "${address}", environment="${process.env.NODE_ENV}"`
				)
			}
		})
	} catch (err) {
		console.error('error starting app', err)
		throw err
	}
}

process.on('unhandledRejection', (reason, promise) => {
	console.log('caught unhandled rejection', reason)
})
startup()
