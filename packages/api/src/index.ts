/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppBuilder, Configuration, AppContextProvider } from '~components'

async function startup() {
	try {
		console.log(`preparing server`)
		const config = new Configuration()
		console.log('validating configuration...')
		config.validate()
		console.log('configuration validated, creating app context')
		const contextProvider = new AppContextProvider(config)
		const appBuilder = new AppBuilder(contextProvider)
		console.log('starting server...')
		appBuilder.start()
	} catch (err) {
		console.error('error starting app', err)
		throw err
	}
}

process.on('unhandledRejection', (reason, promise) => {
	console.log('caught unhandled rejection', reason)
})
startup()
