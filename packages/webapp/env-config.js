/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const config = require('config')

const environment = {
	'process.env.API_URL': config.get('api.url'),
	'process.env.API_SOCKET_URL': config.get('api.socketUrl'),
	'process.env.APPLICATION_INSIGHTS_INSTRUMENTATION_KEY': config.get('applicationInsights.key'),
	'process.env.APPLICATION_INSIGHTS_DEBUG': config.get('applicationInsights.debug')
}

console.log('exporting environment', environment)
module.exports = environment
