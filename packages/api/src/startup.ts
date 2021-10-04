/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import http from 'http'
import { AppBuilder, Configuration, AppContextProvider } from '~components'
import { createLogger } from '~utils'
const logger = createLogger('startup', true)

function getConfiguration(): Configuration {
	logger('loading configuration...')
	const result = new Configuration()
	logger('validating configuration...')
	result.validate()
	return result
}

export async function startup(): Promise<http.Server> {
	try {
		logger(`preparing server`)
		const config = getConfiguration()
		logger('creating app context...')
		const contextProvider = new AppContextProvider(config)
		const appBuilder = new AppBuilder(contextProvider)
		logger('starting server...')
		return appBuilder.start()
	} catch (err) {
		logger('error starting app', err)
		throw err
	}
}
