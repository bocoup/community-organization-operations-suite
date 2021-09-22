/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AppBuilder, Configuration, AppContextProvider } from '~components'

function getConfiguration(): Configuration {
	console.log('loading configuration...')
	const result = new Configuration()
	console.log('validating configuration...')
	result.validate()
	return result
}

export async function startup() {
	try {
		console.log(`preparing server`)
		const config = getConfiguration()
		console.log('creating app context...')
		const contextProvider = new AppContextProvider(config)
		const appBuilder = new AppBuilder(contextProvider)
		console.log('starting server...')
		appBuilder.start()
	} catch (err) {
		console.error('error starting app', err)
		throw err
	}
}
