/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
const env = require('./env-config')

module.exports = {
	plugins: [['transform-define', env]]
}
