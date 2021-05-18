/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const config = require('config')

module.exports = {
	'process.env.API_URL': config.get('api.url')
}
